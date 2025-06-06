// Supabaseモククライアント
export const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => {
      console.debug(`Mock client accessing table: ${table}`);
      return {
        select: () => ({
          eq: () => ({
            order: () => ({ data: [], error: null }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => ({ data: null, error: null }),
          }),
        }),
      };
    },
  };
};

export default createMockClient;
