import { prisma } from "../src/lib/db";
import Types from "../resources/Types.json"
import Tags from "../resources/Tags.json"

import Tools from "../resources/Tools.json";

const storeInitialUser = async () => {
    try {
      // createMany inserts the entire array into your Neon table in a single query
      const result = await prisma.users.createMany({
          data: {
            clerk_user_id: "user_3GiYzZDINAdbX4Etnx59ypUxwSV",
            first_name: "Hanif",
            last_name: "Afrian",
            image_url: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zR2lZellCMXFBNU9pUldNSXZrdU1vMHc1ZngifQ",
            email: "idn_3GiYyQJXMpQzdCtF19qgi6rQ4Cw",
            full_name: "Hanif Afrian",
            username: "afrian"
          }, 
          // skipDuplicates: true, // Optional: ignores errors if a unique key matches
      });

      console.log(result)

      console.log(`Successfully inserted ${result.count} users!`);
  //     return result;

  } catch (error) {
      console.error("Failed to insert data:", error instanceof Error ? error.message : "Database connection lost.");
  }
}
const storeTags = async () => {
    try {
      // createMany inserts the entire array into your Neon table in a single query
      const result = await prisma.tags.createMany({
          data: Tags, 
          // skipDuplicates: true, // Optional: ignores errors if a unique key matches
      });

      console.log(result)

      console.log(`Successfully inserted ${result.count} rows!`);
  //     return result;

  } catch (error) {
      console.error("Failed to insert data:", error instanceof Error ? error.message : "Database connection lost.");
  }
}

const storeTools = async () => {
    try {
      // createMany inserts the entire array into your Neon table in a single query
      const result = await prisma.tools.createMany({
          data: Tools, 
          // skipDuplicates: true, // Optional: ignores errors if a unique key matches
      });

      console.log(result)

      console.log(`Successfully inserted ${result.count} rows!`);
  //     return result;

  } catch (error) {
      console.error("Failed to insert data:", error instanceof Error ? error.message : "Database connection lost.");
  }
}

const storeTypes = async () => {
    try {
      // createMany inserts the entire array into your Neon table in a single query
      const result = await prisma.types.createMany({
          data: Types, 
          // skipDuplicates: true, // Optional: ignores errors if a unique key matches
      });

      console.log(result)

      console.log(`Successfully inserted ${result.count} rows!`);
  //     return result;

  } catch (error) {
      console.error("Failed to insert data:", error instanceof Error ? error.message : "Database connection lost.");
  }
}


const initialData = async () => {
  await storeInitialUser()
  await storeTags()
  await storeTools()
  await storeTypes()
}

initialData()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })