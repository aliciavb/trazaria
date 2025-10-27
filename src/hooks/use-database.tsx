import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useFoods() {
  const foods = useLiveQuery(() => db.foods.toArray(), []);
  return { foods: foods ?? [], loading: !foods };
}

export function useEquivalences() {
  const equivalences = useLiveQuery(() => db.equivalences.toArray(), []);
  return { equivalences: equivalences ?? [], loading: !equivalences };
}

export function useEntries(dateISO?: string) {
  const entries = useLiveQuery(
    () => {
      if (dateISO) {
        return db.entries.where('dateISO').equals(dateISO).toArray();
      }
      return db.entries.toArray();
    },
    [dateISO]
  );
  return { entries: entries ?? [], loading: !entries };
}

export function useProfile() {
  const profile = useLiveQuery(() => db.profile.get('user-profile'));
  return { profile: profile ?? null, loading: profile === undefined };
}
