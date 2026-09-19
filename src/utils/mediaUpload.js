import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Supabase env vars missing. Check frontend/.env");
}

const supabase = createClient(url, key);

export default function uploadMedia(file) {
    return new Promise((resolve, reject) => {
        if (file == null) {
            reject("No file provided");
        } else {
            const timestamp = new Date().getTime();
            const fileName = timestamp + "_" + file.name;

            supabase.storage
                .from("images")
                .upload(fileName, file)
                .then(() => {
                    const publicUrl = supabase.storage
                        .from("images")
                        .getPublicUrl(fileName).data.publicUrl;
                    resolve(publicUrl);
                })
                .catch((error) => {
                    reject(error);
                });
        }
    });
}