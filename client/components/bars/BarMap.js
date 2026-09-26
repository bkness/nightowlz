import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import colors from "../../theme/colors";

// Native map. The web build uses BarMap.web.js instead — react-native-maps
// has no web implementation and crashes the whole bundle if imported there.
export default function BarMap({ bar, style }) {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={style}
      initialRegion={{
        latitude: bar.lat,
        longitude: bar.lon,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
    >
      <Marker
        coordinate={{ latitude: bar.lat, longitude: bar.lon }}
        title={bar.name}
        pinColor={colors.neonYellow}
      />
    </MapView>
  );
}
