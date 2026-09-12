import { createClient } from "@supabase/supabase-js";

const key =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0d2xjZWVnb3NtdnNqcWdsc3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjU0OTcsImV4cCI6MjA5MzA0MTQ5N30.buuuAMS_u-LD_9D6lqBxcKusnTKED3w9e6ppZAhMspI";
const url = "https://ltwlceegosmvsjqglszi.supabase.co";

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
				}).catch((error) => {
                    reject(error);
                });
		}
	});
}
