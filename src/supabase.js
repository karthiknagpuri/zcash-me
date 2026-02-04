// Mock Supabase client with schema-accurate dummy data

const dummyProfiles = [
  {
    id: 15,
    address: "u1gex2wm56xgveqx2hvxylwtla6nz03scyrpvyvhfccnvuv3kaetlnxe6x4d7ljf7cwqq7etj7m4p33064rsxft7se26yzgrs540trahn6ldp9cxe2d27wa98hml6a3mmn7ephyqagy8grr8z06ufqnnzy3c6e37kefazuf4k3nvchfh08",
    name: "SaveZcash",
    bio: "ZEC is not a trade. ZEC is a unit of account.",
    claim_code: null,
    claimed_at: null,
    created_at: "2025-09-07 14:25:06.869427+00",
    last_signed_at: null,
    signin_challenge_code: null,
    signin_challenge_txid: null,
    ephemeral_expires_at: null,
    status_computed: "unclaimed",
    slug: "savezcash",
    referred_by: null,
    address_verified: true,
    featured: false,
    profile_image_url: "https://pbs.twimg.com/profile_images/1989878093066989568/T9sU8jjO_400x400.jpg",
    last_verified_at: "2026-01-17 16:05:10.310432+00",
    verification_expires_at: null,
    referred_by_zcasher_id: null,
    verif_expires_at: "2026-02-20 16:05:10.310432+00",
    category: null,
    nearest_city_id: 1840020491,
    nearest_city_name: "Los Angeles, California, United States",
    is_ns: false,
    is_ns_longterm: false,
    ns_version: null,
    is_ns_core: false,
    display_name: "Safety First!",
    iso2: "US",
    country: "United States",
    rank_alltime: 1,
    rank_weekly: 1,
    rank_monthly: 1,
    referrer_count: 12,
  },
  {
    id: 415,
    address: "u1tdkyje8l5grq8h9ucnpsnkj4m2etmmwzmkyswfe84p03j64k0nuxclygulsrfdxhjc6h4xsk9kmd9g6zzmv4yften2x8ju873jrmglelcsmev63l3vcph3aqrl323m5unuxqlvxmyfcuh3ptvzpgucdhhtvgs66jw0jrdllvm5xegn0e",
    name: "Zechariah",
    bio: "Returning from exile like...",
    claim_code: null,
    claimed_at: null,
    created_at: "2025-10-15 06:17:32.489+00",
    last_signed_at: null,
    signin_challenge_code: null,
    signin_challenge_txid: null,
    ephemeral_expires_at: null,
    status_computed: "unclaimed",
    slug: null,
    referred_by: "SaveZcash",
    address_verified: true,
    featured: true,
    profile_image_url: "https://cdn.discordapp.com/avatars/678677504332005378/577d6afe2580cf85eb6ea4faed9cac5b.png?size=4096",
    last_verified_at: "2026-01-18 06:08:39.671061+00",
    verification_expires_at: null,
    referred_by_zcasher_id: 15,
    verif_expires_at: "2026-02-20 06:08:39.671061+00",
    category: null,
    nearest_city_id: 1458747615,
    nearest_city_name: "Johor Bahru, Johor, Malaysia",
    is_ns: true,
    is_ns_longterm: true,
    ns_version: 2,
    is_ns_core: false,
    display_name: "Encrypted James",
    iso2: "MY",
    country: "Malaysia",
    rank_alltime: 2,
    rank_weekly: 2,
    rank_monthly: 2,
    referrer_count: 8,
  },
  {
    id: 445,
    address: "u1vlmjxm26758le2u8ud0std3t0w44ce9dqtfsjcff7366dshqsyax0ps5y84fstd83s6mgrze0yjpxuw82z07nllp5yy6v2ufdztre8yjf5tkhueqcw3a0x8mhn3y2q920x88x9hecrsrsm439lv0zvx7mpscl4ehf37kvmcpy5wlk829",
    name: "frankbraun",
    bio: "Freedom | Privacy | Investing | Programming. The future is private.",
    claim_code: null,
    claimed_at: null,
    created_at: "2025-10-15 23:43:02.305+00",
    last_signed_at: null,
    signin_challenge_code: null,
    signin_challenge_txid: null,
    ephemeral_expires_at: null,
    status_computed: "unclaimed",
    slug: null,
    referred_by: "Adam",
    address_verified: true,
    featured: true,
    profile_image_url: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/445_zmp.png",
    last_verified_at: "2025-10-23 10:58:54.721199+00",
    verification_expires_at: null,
    referred_by_zcasher_id: 221,
    verif_expires_at: "2025-11-21 10:58:54.721199+00",
    category: null,
    nearest_city_id: null,
    nearest_city_name: null,
    is_ns: false,
    is_ns_longterm: false,
    ns_version: null,
    is_ns_core: false,
    display_name: null,
    iso2: null,
    country: null,
    rank_alltime: 3,
    rank_weekly: 3,
    rank_monthly: 3,
    referrer_count: 5,
  },
  {
    id: 159,
    address: "u1sjt7urqqekjnkrmy825zg8qnld92f3vfc8uj3rwfczlx467q7dcq66ru4cesgt2ywnvdkvghg7m6wsmyn9eafxat0rqhpehmd887kwqmavtxj8vjnjeusnwwqjp3tr3mzm88n4lhj5fgk35xn3epxzzuenyfd9deftzmlzqnlcnd658v",
    name: "Tony Margarit",
    bio: "Finance & Ops at Electric Coin Company. Working on Zcash and Zashi app.",
    claim_code: null,
    claimed_at: null,
    created_at: "2025-10-13 14:34:39.116+00",
    last_signed_at: null,
    signin_challenge_code: null,
    signin_challenge_txid: null,
    ephemeral_expires_at: null,
    status_computed: "unclaimed",
    slug: null,
    referred_by: "yoshi",
    address_verified: true,
    featured: true,
    profile_image_url: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/159_zmp.png",
    last_verified_at: "2025-10-23 10:58:54.721199+00",
    verification_expires_at: null,
    referred_by_zcasher_id: 62,
    verif_expires_at: "2025-11-21 10:58:54.721199+00",
    category: null,
    nearest_city_id: null,
    nearest_city_name: null,
    is_ns: false,
    is_ns_longterm: false,
    ns_version: null,
    is_ns_core: false,
    display_name: null,
    iso2: null,
    country: null,
    rank_alltime: 4,
    rank_weekly: 4,
    rank_monthly: 4,
    referrer_count: 3,
  },
  {
    id: 475,
    address: "u1ws7nfhsfqnsm4gvk3kh0w85wrqgtx7xssxrrsw7jkyztwtd59czfr5de5avjfmscnl4sm7rtn33ntnnxam6avryaej73wurdj3epq0yyu3jm6hlylmpc083yywtj2f0z8mtmwxc4dk98rxgkjn3z92yzxtzdguvm7axhzj7hcuglzthy",
    name: "blazeyoru",
    bio: null,
    claim_code: null,
    claimed_at: null,
    created_at: "2025-10-16 15:54:43.962+00",
    last_signed_at: null,
    signin_challenge_code: null,
    signin_challenge_txid: null,
    ephemeral_expires_at: null,
    status_computed: "unclaimed",
    slug: null,
    referred_by: "yoshi",
    address_verified: true,
    featured: false,
    profile_image_url: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/475_zmp.png",
    last_verified_at: null,
    verification_expires_at: null,
    referred_by_zcasher_id: 62,
    verif_expires_at: null,
    category: null,
    nearest_city_id: null,
    nearest_city_name: null,
    is_ns: false,
    is_ns_longterm: false,
    ns_version: null,
    is_ns_core: false,
    display_name: null,
    iso2: null,
    country: null,
    rank_alltime: 5,
    rank_weekly: 5,
    rank_monthly: 5,
    referrer_count: 2,
  },
];

const dummyLinks = [
  { id: 1157, zcasher_id: 15, label: "SaveZcash", url: "https://x.com/SaveZcash", order_index: 0, created_at: "2026-01-17 08:25:32.081431+00", updated_at: "2026-01-17 08:26:08.657193+00", is_verified: true, pending_verif: false },
  { id: 118, zcasher_id: 415, label: "zechariah8839", url: "https://discord.com/users/678677504332005378", order_index: 0, created_at: "2025-10-17 09:59:56.363496+00", updated_at: "2026-01-08 16:38:39.518211+00", is_verified: true, pending_verif: false },
  { id: 1025, zcasher_id: 415, label: "ZcashUsersGroup", url: "https://github.com/ZcashUsersGroup", order_index: 0, created_at: "2025-12-20 18:43:00.15973+00", updated_at: "2026-01-08 16:38:57.766099+00", is_verified: true, pending_verif: false },
  { id: 309, zcasher_id: 445, label: "frankbraun.org", url: "https://frankbraun.org/", order_index: 0, created_at: "2025-10-19 14:07:06.268424+00", updated_at: "2026-01-08 07:59:10.486776+00", is_verified: false, pending_verif: false },
  { id: 308, zcasher_id: 445, label: "thefrankbraun", url: "https://x.com/thefrankbraun", order_index: 0, created_at: "2025-10-19 14:06:20.461112+00", updated_at: "2026-01-08 07:59:10.486776+00", is_verified: true, pending_verif: false },
  { id: 113, zcasher_id: 159, label: "tonymargarit", url: "https://www.linkedin.com/in/tonymargarit", order_index: 0, created_at: "2025-10-17 08:06:16.034727+00", updated_at: "2026-01-08 07:59:10.486776+00", is_verified: false, pending_verif: false },
  { id: 111, zcasher_id: 159, label: "tonymargarit", url: "https://x.com/tonymargarit", order_index: 0, created_at: "2025-10-17 07:33:49.955222+00", updated_at: "2026-01-08 07:59:10.486776+00", is_verified: true, pending_verif: false },
  { id: 499, zcasher_id: 475, label: "blazeyoru", url: "https://x.com/blazeyoru", order_index: 0, created_at: "2025-10-25 21:51:35.435631+00", updated_at: "2026-01-08 07:59:10.486776+00", is_verified: true, pending_verif: false },
];

const dummyGrowthDaily = Array.from({ length: 30 }, (_, i) => ({
  day_start: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cumulative_count: 100 + i * 5,
  new_count: 3 + Math.floor(Math.random() * 5),
}));

const dummyGrowthWeekly = Array.from({ length: 12 }, (_, i) => ({
  week_start: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cumulative_count: 50 + i * 20,
  new_count: 10 + Math.floor(Math.random() * 15),
}));

const dummyGrowthMonthly = Array.from({ length: 12 }, (_, i) => ({
  month_start: new Date(2024, i, 1).toISOString().split('T')[0],
  cumulative_count: 20 + i * 50,
  new_count: 30 + Math.floor(Math.random() * 30),
}));

const dummyCities = [
  { id: 1840020491, city: "Los Angeles", admin_name: "California", country: "United States", lat: 34.0522, lng: -118.2437 },
  { id: 1458747615, city: "Johor Bahru", admin_name: "Johor", country: "Malaysia", lat: 1.4927, lng: 103.7414 },
  { id: 1, city: "San Francisco", admin_name: "California", country: "United States", lat: 37.7749, lng: -122.4194 },
  { id: 2, city: "Tokyo", admin_name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { id: 3, city: "Berlin", admin_name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
];

// Create chainable query builder
function createQueryBuilder(data) {
  let result = [...data];
  let selectedColumns = null;

  const builder = {
    select: (columns = '*') => {
      selectedColumns = columns;
      return builder;
    },
    eq: (column, value) => {
      result = result.filter(item => item[column] === value);
      return builder;
    },
    neq: (column, value) => {
      result = result.filter(item => item[column] !== value);
      return builder;
    },
    in: (column, values) => {
      result = result.filter(item => values.includes(item[column]));
      return builder;
    },
    ilike: (column, pattern) => {
      const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
      result = result.filter(item => regex.test(item[column] || ''));
      return builder;
    },
    or: (conditions) => {
      return builder;
    },
    is: (column, value) => {
      result = result.filter(item => item[column] === value);
      return builder;
    },
    not: (column, operator, value) => {
      return builder;
    },
    order: (column, options = {}) => {
      const ascending = options.ascending !== false;
      result.sort((a, b) => {
        if (ascending) return a[column] > b[column] ? 1 : -1;
        return a[column] < b[column] ? 1 : -1;
      });
      return builder;
    },
    limit: (count) => {
      result = result.slice(0, count);
      return builder;
    },
    range: (from, to) => {
      result = result.slice(from, to + 1);
      return builder;
    },
    single: () => {
      return Promise.resolve({ data: result[0] || null, error: null });
    },
    maybeSingle: () => {
      return Promise.resolve({ data: result[0] || null, error: null });
    },
    insert: (rows) => {
      console.log('[Mock Supabase] Insert:', rows);
      return Promise.resolve({ data: rows, error: null });
    },
    update: (values) => {
      console.log('[Mock Supabase] Update:', values);
      return builder;
    },
    upsert: (rows) => {
      console.log('[Mock Supabase] Upsert:', rows);
      return Promise.resolve({ data: rows, error: null });
    },
    delete: () => {
      console.log('[Mock Supabase] Delete');
      return builder;
    },
    then: (resolve) => {
      resolve({ data: result, error: null, count: result.length });
    },
  };

  return builder;
}

// Mock auth state
let currentSession = null;
const authListeners = [];

export const supabase = {
  from: (table) => {
    const tableData = {
      zcasher: dummyProfiles,
      zcasher_searchable: dummyProfiles,
      zcasher_links: dummyLinks,
      referrer_ranked_alltime: dummyProfiles,
      referrer_ranked_weekly: dummyProfiles.slice(0, 3),
      referrer_ranked_monthly: dummyProfiles.slice(0, 3),
      referrer_ranked_daily: dummyProfiles.slice(0, 2),
      growth_over_time: dummyGrowthWeekly,
      growth_over_time_daily: dummyGrowthDaily,
      growth_over_time_monthly: dummyGrowthMonthly,
      worldcities: dummyCities,
    };
    return createQueryBuilder(tableData[table] || []);
  },

  rpc: (functionName, params) => {
    console.log('[Mock Supabase] RPC:', functionName, params);
    if (functionName === 'confirm_otp_sql') {
      return Promise.resolve({ data: { success: true }, error: null });
    }
    return Promise.resolve({ data: null, error: null });
  },

  auth: {
    getSession: () => {
      return Promise.resolve({ data: { session: currentSession }, error: null });
    },
    getUser: () => {
      return Promise.resolve({
        data: { user: currentSession?.user || null },
        error: null
      });
    },
    signInWithOAuth: ({ provider }) => {
      console.log('[Mock Supabase] OAuth sign in with:', provider);
      return Promise.resolve({ data: null, error: null });
    },
    signOut: () => {
      currentSession = null;
      authListeners.forEach(cb => cb('SIGNED_OUT', null));
      return Promise.resolve({ error: null });
    },
    onAuthStateChange: (callback) => {
      authListeners.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = authListeners.indexOf(callback);
              if (idx > -1) authListeners.splice(idx, 1);
            },
          },
        },
      };
    },
  },

  storage: {
    from: (bucket) => ({
      upload: (path, file) => {
        console.log('[Mock Supabase] Storage upload:', bucket, path);
        return Promise.resolve({ data: { path }, error: null });
      },
      getPublicUrl: (path) => ({
        data: { publicUrl: `https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/${bucket}/${path}` },
      }),
    }),
  },
};

export default supabase;
