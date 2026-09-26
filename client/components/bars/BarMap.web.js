import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { api } from "../../utils/api";
import colors from "../../theme/colors";

// Web map: Apple MapKit JS (react-native-maps has no web implementation).
// Tokens come from the server's /maps/mapkit-token, signed with the same
// Maps key the app already uses. MapKit calls authorizationCallback again
// whenever a token nears expiry, so nothing needs a refresh timer.
// If MapKit can't load, fall back to an OpenStreetMap embed.
const MAPKIT_SRC = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
const SPAN = 0.005; // matches the native map's latitude/longitudeDelta

let mapkitReady; // one script load + init shared by every map on the page

function loadMapKit() {
  if (mapkitReady) return mapkitReady;
  mapkitReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = MAPKIT_SRC;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      window.mapkit.init({
        authorizationCallback: (done) => {
          api
            .get("/maps/mapkit-token", { responseType: "text" })
            .then((res) => done(res.data))
            .catch(() => done(""));
        },
      });
      resolve(window.mapkit);
    };
    script.onerror = () => reject(new Error("MapKit JS failed to load"));
    document.head.appendChild(script);
  }).catch((err) => {
    mapkitReady = undefined; // allow a retry on the next map
    throw err;
  });
  return mapkitReady;
}

function OsmFallback({ bar }) {
  const bbox = [bar.lon - SPAN, bar.lat - SPAN, bar.lon + SPAN, bar.lat + SPAN].join(",");
  const src =
    "https://www.openstreetmap.org/export/embed.html" +
    `?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${bar.lat},${bar.lon}`;
  return (
    <iframe
      title={`Map of ${bar.name}`}
      src={src}
      loading="lazy"
      style={{
        border: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        // dark tiles to match the neon theme
        filter: "invert(90%) hue-rotate(180deg) saturate(0.8)",
      }}
    />
  );
}

export default function BarMap({ bar, style }) {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map;
    let cancelled = false;

    loadMapKit()
      .then((mapkit) => {
        if (cancelled || !containerRef.current) return;
        const center = new mapkit.Coordinate(bar.lat, bar.lon);
        map = new mapkit.Map(containerRef.current, {
          region: new mapkit.CoordinateRegion(center, new mapkit.CoordinateSpan(SPAN, SPAN)),
          colorScheme: mapkit.Map.ColorSchemes.Dark,
          isScrollEnabled: false, // static preview, like the native map
          isZoomEnabled: false,
          isRotationEnabled: false,
          showsCompass: mapkit.FeatureVisibility.Hidden,
          showsMapTypeControl: false,
          showsZoomControl: false,
        });
        map.addAnnotation(
          new mapkit.MarkerAnnotation(center, { title: bar.name, color: colors.neonYellow }),
        );
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      map?.destroy();
    };
  }, [bar.lat, bar.lon, bar.name]);

  return (
    <View style={[style, { overflow: "hidden" }]}>
      {failed ? (
        <OsmFallback bar={bar} />
      ) : (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      )}
    </View>
  );
}
