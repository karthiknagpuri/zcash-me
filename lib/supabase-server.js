// Mock Supabase server client with schema-accurate dummy data

const dummyProfiles = [
  {
    id: 15,
    address: "u1gex2wm56xgveqx2hvxylwtla6nz03scyrpvyvhfccnvuv3kaetlnxe6x4d7ljf7cwqq7etj7m4p33064rsxft7se26yzgrs540trahn6ldp9cxe2d27wa98hml6a3mmn7ephyqagy8grr8z06ufqnnzy3c6e37kefazuf4k3nvchfh08",
    name: "SaveZcash",
    bio: "ZEC is not a trade. ZEC is a unit of account.",
    status_computed: "unclaimed",
    slug: "savezcash",
    address_verified: true,
    featured: false,
    profile_image_url: "https://pbs.twimg.com/profile_images/1989878093066989568/T9sU8jjO_400x400.jpg",
    nearest_city_name: "Los Angeles, California, United States",
    display_name: "Safety First!",
    iso2: "US",
    country: "United States",
    rank_alltime: 1,
    rank_weekly: 1,
    rank_monthly: 1,
    rank_daily: 1,
    referrer_count: 12,
  },
  {
    id: 415,
    address: "u1tdkyje8l5grq8h9ucnpsnkj4m2etmmwzmkyswfe84p03j64k0nuxclygulsrfdxhjc6h4xsk9kmd9g6zzmv4yften2x8ju873jrmglelcsmev63l3vcph3aqrl323m5unuxqlvxmyfcuh3ptvzpgucdhhtvgs66jw0jrdllvm5xegn0e",
    name: "Zechariah",
    bio: "Returning from exile like...",
    status_computed: "unclaimed",
    referred_by: "SaveZcash",
    address_verified: true,
    featured: true,
    profile_image_url: "https://cdn.discordapp.com/avatars/678677504332005378/577d6afe2580cf85eb6ea4faed9cac5b.png?size=4096",
    nearest_city_name: "Johor Bahru, Johor, Malaysia",
    is_ns: true,
    is_ns_longterm: true,
    ns_version: 2,
    display_name: "Encrypted James",
    iso2: "MY",
    country: "Malaysia",
    rank_alltime: 2,
    rank_weekly: 2,
    rank_monthly: 2,
    rank_daily: 2,
    referrer_count: 8,
  },
  {
    id: 445,
    address: "u1vlmjxm26758le2u8ud0std3t0w44ce9dqtfsjcff7366dshqsyax0ps5y84fstd83s6mgrze0yjpxuw82z07nllp5yy6v2ufdztre8yjf5tkhueqcw3a0x8mhn3y2q920x88x9hecrsrsm439lv0zvx7mpscl4ehf37kvmcpy5wlk829",
    name: "frankbraun",
    bio: "Freedom | Privacy | Investing | Programming. The future is private.",
    status_computed: "unclaimed",
    referred_by: "Adam",
    address_verified: true,
    featured: true,
    profile_image_url: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/445_zmp.png",
    rank_alltime: 3,
    rank_weekly: 3,
    rank_monthly: 3,
    rank_daily: 3,
    referrer_count: 5,
  },
  {
    id: 159,
    address: "u1sjt7urqqekjnkrmy825zg8qnld92f3vfc8uj3rwfczlx467q7dcq66ru4cesgt2ywnvdkvghg7m6wsmyn9eafxat0rqhpehmd887kwqmavtxj8vjnjeusnwwqjp3tr3mzm88n4lhj5fgk35xn3epxzzuenyfd9deftzmlzqnlcnd658v",
    name: "Tony Margarit",
    bio: "Finance & Ops at Electric Coin Company. Working on Zcash and Zashi app.",
    status_computed: "unclaimed",
    referred_by: "yoshi",
    address_verified: true,
    featured: true,
    profile_image_url: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/159_zmp.png",
    rank_alltime: 4,
    rank_weekly: 4,
    rank_monthly: 4,
    rank_daily: 4,
    referrer_count: 3,
  },
  {
    id: 475,
    address: "u1ws7nfhsfqnsm4gvk3kh0w85wrqgtx7xssxrrsw7jkyztwtd59czfr5de5avjfmscnl4sm7rtn33ntnnxam6avryaej73wurdj3epq0yyu3jm6hlylmpc083yywtj2f0z8mtmwxc4dk98rxgkjn3z92yzxtzdguvm7axhzj7hcuglzthy",
    name: "blazeyoru",
    bio: null,
    status_computed: "unclaimed",
    referred_by: "yoshi",
    address_verified: true,
    featured: false,
    profile_image_url: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/475_zmp.png",
    rank_alltime: 5,
    rank_weekly: 5,
    rank_monthly: 5,
    rank_daily: 5,
    referrer_count: 2,
  },
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

function createQueryBuilder(data) {
  let result = [...data];

  const builder = {
    select: (columns = '*') => builder,
    eq: (column, value) => {
      result = result.filter(item => item[column] === value);
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
    then: (resolve) => {
      resolve({ data: result, error: null });
    },
  };

  return builder;
}

export function createSupabaseServerClient() {
  return {
    from: (table) => {
      const tableData = {
        growth_over_time_daily: dummyGrowthDaily,
        growth_over_time: dummyGrowthWeekly,
        growth_over_time_monthly: dummyGrowthMonthly,
        referrer_ranked_alltime: dummyProfiles,
        referrer_ranked_weekly: dummyProfiles,
        referrer_ranked_monthly: dummyProfiles,
        referrer_ranked_daily: dummyProfiles,
      };
      return createQueryBuilder(tableData[table] || []);
    },
  };
}
