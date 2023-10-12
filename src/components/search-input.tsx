import { data } from "@/data";

export default function SearchInput() {
  return (
    <section>
      <input
        type="text"
        placeholder="buscar..."
        className="p-2 w-full border-2"
      />
      <section>
        {data.map((d) => (
          <div key={d.id}>
            <img src="https://instagram.fros8-1.fna.fbcdn.net/v/t51.2885-15/374203076_284458817667132_7590749906608603855_n.heic?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fros8-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=RDVk9OaH6VwAX_zdjVO&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfCO7w2YUc06O2imKexIgULD-YhGxDk3Q2uXTzaDBNWUyA&oe=652CDABA&_nc_sid=2999b8" />
          </div>
        ))}
      </section>
    </section>
  );
}
