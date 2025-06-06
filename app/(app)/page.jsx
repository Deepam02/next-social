import HomeView from "@/sections/home/view/HomeView";


export const metadata = () => {
  return {
    title: `Socialhop`,
    description: `New way to feel freedom`,
  };
};

const HomePage = async () => {
return <HomeView/>

};

export default HomePage;