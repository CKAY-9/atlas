import AtlasWrapper from "@/components/wrapper/wrapper";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    "title": "Home - Atlas",
    "description": "View all your notifications, announcments, messages, and more on Atlas."
  }
}

const HomePage = async () => {
  return (
    <>
      <AtlasWrapper>
        <h1>Hello, USER</h1>
      </AtlasWrapper>
    </>
  );
}

export default HomePage;
