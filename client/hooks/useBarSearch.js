import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export const SEARCH_MODE_OPTIONS = [
  { id: "bars", label: "Bars" },
  { id: "clubs", label: "Clubs" },
  { id: "live_music", label: "Live Music" },
  { id: "entertainment", label: "Shows" },
];

export default function useBarSearch() {
  const { token } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [bars, setBars] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchModes, setSearchModes] = useState(["bars", "clubs", "live_music", "entertainment"]);
  const [resultSource, setResultSource] = useState("");
  const [savedBarIds, setSavedBarIds] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(30);
  const searchTimeout = useRef(null);
  const latestSearchTextRef = useRef("");

  const runSearch = useCallback(async (query, modes) => {
    if (query.trim().length < 2) {
      setBars([]);
      setResultSource("");
      return;
    }
    setSearching(true);
    setVisibleCount(30);
    try {
      const { data } = await api.get("/maps/places", {
        params: { q: query.trim(), modes: modes.join(",") },
      });
      setBars(data.bars || []);
      setResultSource(data.source || "");
    } catch (err) {
      console.error("Search error:", err?.response?.data || err?.message);
      setBars([]);
      setResultSource("");
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearch = useCallback((text) => {
    setSearchText(text);
    latestSearchTextRef.current = text;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (text.trim().length < 2) {
      setBars([]);
      setResultSource("");
      return;
    }
    searchTimeout.current = setTimeout(() => {
      runSearch(text, searchModes);
    }, 600);
  }, [searchModes, runSearch]);

  const toggleMode = useCallback((modeId) => {
    setSearchModes((prev) => {
      const next = prev.includes(modeId)
        ? prev.filter((m) => m !== modeId)
        : [...prev, modeId];
      return next.length === 0 ? prev : next;
    });
  }, []);

  useEffect(() => {
    if (latestSearchTextRef.current.trim().length >= 2) {
      runSearch(latestSearchTextRef.current, searchModes);
    }
  }, [searchModes, runSearch]);

  const loadSavedBars = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/saved-bars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedBarIds(new Set((data.bars || []).map((b) => String(b.barId))));
    } catch {}
  }, [token]);

  return {
    searchText,
    bars,
    searching,
    searchModes,
    resultSource,
    savedBarIds,
    visibleCount,
    setVisibleCount,
    latestSearchTextRef,
    handleSearch,
    toggleMode,
    runSearch,
    loadSavedBars,
  };
}
