import { supabase } from "../supabaseClient";

const fetchGuestbookEntries = async () => {
    const { data, error } = await supabase.from("guest_book").select("*");
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data;
    }



const addGuestbookEntry = async ({name, entry}: {name: string, entry: string}) => {
    const { data, error } = await supabase.from("guest_book").insert([{ name, entry }]);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data;
    }


export { fetchGuestbookEntries, addGuestbookEntry };