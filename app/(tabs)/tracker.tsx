import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/ui/AppHeader';
import { Dua, getAllDuas, getCategoryById } from '../../lib/data/duas';
import { useUserProgressStore } from '../../stores/userProgressStore';

const { width } = Dimensions.get('window');

const THEME = {
  primary: '#7E57C2',
  primaryLight: '#EDE7F6',
  neutral: '#FFFFFF',
  bg: '#F5F3FB',
  text: {
    primary: '#2D3748',
    secondary: '#718096',
    light: '#FFFFFF',
    muted: '#A0AEC0',
  },
};

const STATUS = {
  memorized:  { color: '#22C55E', bg: '#DCFCE7', label: 'Memorized' },
  learning:   { color: '#F59E0B', bg: '#FEF3C7', label: 'Learning'  },
  not_started:{ color: '#CBD5E0', bg: '#F7FAFC', label: 'Not Started'},
};

// ─── Stats strip ────────────────────────────────────────────────────────────

const StatsBar = ({ duas }: { duas: Dua[] }) => {
  const memorized = duas.filter(d => d.memorization_status === 'memorized').length;
  const learning  = duas.filter(d => d.memorization_status === 'learning').length;
  const total     = duas.length;
  const pct       = total > 0 ? (memorized / total) * 100 : 0;

  return (
    <View style={styles.statsBar}>
      <View style={styles.statCell}>
        <Text style={[styles.statNum, { color: '#22C55E' }]}>{memorized}</Text>
        <Text style={styles.statLbl}>Memorized</Text>
      </View>
      <View style={styles.statSep} />
      <View style={styles.statCell}>
        <Text style={[styles.statNum, { color: '#F59E0B' }]}>{learning}</Text>
        <Text style={styles.statLbl}>Learning</Text>
      </View>
      <View style={styles.statSep} />
      <View style={styles.statCell}>
        <Text style={[styles.statNum, { color: THEME.primary }]}>{total}</Text>
        <Text style={styles.statLbl}>Total</Text>
      </View>
      <View style={styles.statSep} />
      <View style={styles.statCell}>
        <Text style={[styles.statNum, { color: THEME.primary }]}>{Math.round(pct)}%</Text>
        <Text style={styles.statLbl}>Done</Text>
      </View>

      {/* thin progress bar along the bottom */}
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={['#7E57C2', '#22C55E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${pct}%` as any }]}
        />
      </View>
    </View>
  );
};

// ─── Filter chips ────────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'all',       label: 'All',         emoji: '📖' },
  { id: 'favorite',  label: 'Favorites',   emoji: '❤️' },
  { id: 'memorized', label: 'Memorized',   emoji: '✅' },
  { id: 'practice',  label: 'In Progress', emoji: '🔄' },
];

const FilterChips = ({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.chipsScroll}
    contentContainerStyle={styles.chipsContent}
  >
    {FILTERS.map(f => {
      const isActive = f.id === active;
      return (
        <TouchableOpacity
          key={f.id}
          style={[styles.chip, isActive && styles.chipActive]}
          onPress={() => onChange(f.id)}
          activeOpacity={0.75}
        >
          <Text style={styles.chipEmoji}>{f.emoji}</Text>
          <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
            {f.label}
          </Text>
          <View style={[styles.chipBadge, isActive && styles.chipBadgeActive]}>
            <Text style={[styles.chipBadgeText, isActive && styles.chipBadgeTextActive]}>
              {counts[f.id] ?? 0}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

// ─── Dua card ────────────────────────────────────────────────────────────────

const DuaCard = React.memo(({
  dua,
  categoryName,
  onPress,
  onToggleFavorite,
}: {
  dua: Dua;
  categoryName: string;
  onPress: () => void;
  onToggleFavorite: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const cfg = STATUS[dua.memorization_status as keyof typeof STATUS] ?? STATUS.not_started;

  const pressIn  = () => Animated.spring(scale, { toValue: 0.97, tension: 300, friction: 10, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    tension: 300, friction: 10, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
        style={styles.cardInner}
      >
        {/* coloured left accent */}
        <View style={[styles.cardAccent, { backgroundColor: cfg.color }]} />

        {/* thumbnail */}
        {dua.image_path ? (
          <Image source={dua.image_path} style={styles.cardThumb} resizeMode="cover" />
        ) : (
          <View style={[styles.cardThumb, styles.cardThumbFallback]}>
            <Text style={styles.cardThumbEmoji}>🕌</Text>
          </View>
        )}

        {/* text */}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>{dua.title}</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardCategory} numberOfLines={1}>{categoryName}</Text>
            <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
              <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
        </View>

        {/* actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.heart}>{dua.is_favorited ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function DuaTrackerScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const favorites      = useUserProgressStore(s => s.favorites);
  const memorization   = useUserProgressStore(s => s.memorization);
  const toggleFavorite = useUserProgressStore(s => s.toggleFavorite);

  // Always derive status from the Zustand store so that resetAllProgress() immediately
  // reflects on the tracker. Falling back to hardcoded dua data would show stale values
  // after a reset because the raw data has non-empty sample statuses baked in.
  const duas = useMemo<Dua[]>(() =>
    getAllDuas().map(dua => ({
      ...dua,
      is_favorited:        favorites[dua.id]     ?? false,
      memorization_status: (memorization[dua.id] ?? 'not_started') as Dua['memorization_status'],
    })),
    [favorites, memorization]
  );

  const counts = useMemo(() => ({
    all:       duas.length,
    favorite:  duas.filter(d => d.is_favorited).length,
    memorized: duas.filter(d => d.memorization_status === 'memorized').length,
    practice:  duas.filter(d => d.memorization_status !== 'memorized').length,
  }), [duas]);

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'favorite':  return duas.filter(d => d.is_favorited);
      case 'memorized': return duas.filter(d => d.memorization_status === 'memorized');
      case 'practice':  return duas.filter(d => d.memorization_status !== 'memorized');
      default:          return duas;
    }
  }, [duas, activeFilter]);

  const handlePractice = useCallback((dua: Dua) => {
    router.push({
      pathname: '/dua-detail',
      params: {
        id: dua.id,
        title: dua.title,
        arabic: dua.arabic_text,
        translation: dua.translation,
        reference: dua.reference,
        textheading: dua.textheading || '',
        duaNumber: dua.duaNumber || dua.order_index?.toString() || '1',
        categoryName: getCategoryById(dua.category_id)?.name || 'General',
        useLocalImage: 'true',
        localImageIndex: ((parseInt(dua.id) || 1) % 32) + 1,
        imagePath: dua.image_path,
      },
    });
  }, [router]);

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <AppHeader icon="📊" title="Dua Tracker" subtitle="Track your memorization journey" />

        <StatsBar duas={duas} />

        <FilterChips active={activeFilter} onChange={setActiveFilter} counts={counts} />

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>
                {activeFilter === 'all'
                  ? 'Start learning duas to track your progress!'
                  : `No duas match the "${FILTERS.find(f => f.id === activeFilter)?.label}" filter.`}
              </Text>
            </View>
          ) : (
            filtered.map(dua => (
              <DuaCard
                key={dua.id}
                dua={dua}
                categoryName={getCategoryById(dua.category_id)?.name ?? 'General'}
                onPress={() => handlePractice(dua)}
                onToggleFavorite={() => toggleFavorite(dua.id)}
              />
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.bg,
  },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.neutral,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLbl: {
    fontSize: 11,
    color: THEME.text.muted,
    marginTop: 2,
    fontWeight: '500',
  },
  statSep: {
    width: 1,
    height: 30,
    backgroundColor: '#E8E8F0',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EDE7F6',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },

  // Filter chips
  chipsScroll: {
    marginTop: 8,
    maxHeight: 48,
  },
  chipsContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.neutral,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#E8E8F0',
    gap: 4,
  },
  chipActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  chipEmoji: {
    fontSize: 13,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  chipLabelActive: {
    color: THEME.text.light,
  },
  chipBadge: {
    backgroundColor: '#F0EDF8',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  chipBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  chipBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  chipBadgeTextActive: {
    color: THEME.text.light,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Card
  card: {
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: THEME.neutral,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
  },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginLeft: 12,
    flexShrink: 0,
  },
  cardThumbFallback: {
    backgroundColor: 'rgba(126,87,194,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardThumbEmoji: {
    fontSize: 22,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardCategory: {
    fontSize: 12,
    color: THEME.text.muted,
    flexShrink: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    gap: 6,
  },
  heart: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 22,
    color: THEME.text.muted,
    fontWeight: '300',
    lineHeight: 24,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
