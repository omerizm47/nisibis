import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export type LocationPermission = 'granted' | 'denied' | 'undetermined';

export interface UseLocationResult {
  permission: LocationPermission;
  location: Location.LocationObjectCoords | null;
  loading: boolean;
  /** İzni ister; izin verilirse konum takibini başlatır. */
  requestPermission: () => Promise<boolean>;
}

function toPermission(status: Location.PermissionStatus): LocationPermission {
  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
}

/**
 * Konum izni ve canlı konum yönetimi.
 * Konum yalnızca uygulama açıkken (foreground) izlenir; sunucuya gönderilmez.
 */
export function useLocation(autoStart = true): UseLocationResult {
  const [permission, setPermission] = useState<LocationPermission>('undetermined');
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const subRef = useRef<Location.LocationSubscription | null>(null);

  const startWatching = useCallback(async () => {
    try {
      setLoading(true);
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(current.coords);
      subRef.current?.remove();
      subRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 15, timeInterval: 5000 },
        (loc) => setLocation(loc.coords),
      );
    } catch {
      // Konum alınamazsa sessizce devam et.
    } finally {
      setLoading(false);
    }
  }, []);

  const evaluate = useCallback(
    async (request: boolean): Promise<boolean> => {
      let perm = await Location.getForegroundPermissionsAsync();
      if (request && perm.status !== 'granted' && perm.canAskAgain) {
        perm = await Location.requestForegroundPermissionsAsync();
      }
      const status = toPermission(perm.status);
      setPermission(status);
      if (status === 'granted') {
        await startWatching();
        return true;
      }
      return false;
    },
    [startWatching],
  );

  const requestPermission = useCallback(() => evaluate(true), [evaluate]);

  useEffect(() => {
    if (autoStart) {
      void evaluate(false);
    }
    return () => {
      subRef.current?.remove();
      subRef.current = null;
    };
  }, [autoStart, evaluate]);

  return { permission, location, loading, requestPermission };
}
