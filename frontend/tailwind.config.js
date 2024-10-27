import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "off-white": "#f8f9fa",
        "slate-800": "#2d3748",
        "slate-900": "#1e293b",
      },
    },
  },
  plugins: [],
});
