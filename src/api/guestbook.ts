import { supabase } from "../supabaseClient";
const fetchGuestbookEntries = async (from: number, to: number) => {
    const { data, count, error } = await supabase
      .from("guest_book")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
  
    if (error) {
      throw error;
    }
  
    return { entries: data, totalCount: count };
  };


const addGuestbookEntry = async ({name, entry}: {name: string, entry: string}) => {
    const { data, error } = await supabase.from("guest_book").insert([{ name, entry }]);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data;
    }


export { fetchGuestbookEntries, addGuestbookEntry };