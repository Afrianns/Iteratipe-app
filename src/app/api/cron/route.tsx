import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import Redis from "ioredis";

import { redirect } from "next/navigation";

import z from "zod";

const redis = new Redis()

export async function GET(request: Request){
  const types = ["bookmark", "like"]

  try {
    for(let type of types) {
      updateRedisData(type).catch((error) => {
        console.log(error)
      })
    }
    
    // return Response.json({
    //   status: 200,
    //   message: "Redis update initiated"
    // });
    // console.log("data is ", [...projectIds])
    // let deleteUnused = redis.scanStream({
    //   match: '*',
    //   count: 100,
    // });

    // deleteUnused.on('data', (resultKeys) => {

    //   let uniqueKeys = new Set(resultKeys)


    //   uniqueKeys.forEach((key) => {
    //     if(key.split(":")[1]){

    //     }
    //   })
    //   // for (let i = 0; i < resultKeys.length; i++) {
    //   //   console.log(resultKeys[i])
    //   // }
    // })

    // const resultRemove = await prisma.likes.deleteMany({
    //   where: {
    //     project_id: projectId,
    //     user_id: userId
    //   }
    // })

    // if(resultRemove.count != 1) {
    //   const resultAdd = await prisma.likes.create({
    //     data: {
    //       project_id: projectId,
    //       user_id: userId
    //     }
    //   })
      
    //   if(resultAdd.id){
    //     returnValue = {
    //       status: 200,
    //       message: "sucessful liked this project"
    //     }
    //   } else{
    //     throw new Error("Failed to like");
    //   }

    // } else {
    //   returnValue = {
    //     status: 200,
    //     message: "sucessful unlike"
    //   }

    //   type = "unlike"
    // }

    // if(type == "like"){
    //   const message = `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> Liked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`
    //   storeAndNotify(message, userId, projectOwner)
    // }


      // console.log("fetching keys from redis", data)

    return Response.json({
      status: 200,
      message: "Failed to update project. Please try again."
    }, {
      status: 200
    });
  } catch (error) {
    logger.error('Project update endpoint error', undefined, error);
    
    return Response.json({
      status: 500,
      message: "An error occurred while updating your project"
    }, {
      status: 500
    });
  }
}


const updateRedisData = async (type: string) => {
  const uniquekeys = new Set<string>();
  const currentTime = Date.now(); // More performant shorthand

  // --- STEP 1: Process and delete individual likes safely ---
  await new Promise<void>((resolve, reject) => {
    const updateData = redis.scanStream({
      match: `${type}:*`,
      count: 100,
    });


    const processingPromises: Promise<void>[] = [];

    updateData.on('data', (resultKeys) => {
      for (const key of resultKeys) {
        const parts = key.split(":");
        const projectId = parts[1];
        const userId = parts[2];

        if (userId === "increment") {
          uniquekeys.add(projectId);
        } else {

          const task = (async () => {
            const stringifiedValue = await redis.get(key);
            if (!stringifiedValue) return;

            const value = JSON.parse(stringifiedValue);
            if (value.timestamp <= currentTime) {
              await updateDataRedis(value.type, parseInt(projectId), parseInt(userId), type);
            }
          })();
          
          processingPromises.push(task);
        }
      }
    });

    updateData.on("error", (err) => reject(err));

    updateData.on("end", async () => {
      try {
        await Promise.all(processingPromises);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  console.log("Unique keys found for increments:", uniquekeys);
  await deleteLeftover(uniquekeys, type);
};

const updateDataRedis = async (value: string, projectId: number, userId: number, type: string) => {
  type ModelNames = Uncapitalize<Prisma.ModelName>

  const modelName = `${type}s` as ModelNames

  if (value === `un${type}`) {
    await (prisma[modelName] as any).deleteMany({
      where: { project_id: projectId, user_id: userId }
    });
    await redis.incr(`${type}:${projectId}:increment`);
  }
  
  if (value === `${type}`) {
    await (prisma[modelName] as any).create({
      data: { project_id: projectId, user_id: userId }
    });
    await redis.decr(`${type}:${projectId}:increment`);
  }
  await redis.del(`${type}:${projectId}:${userId}`);
};

const deleteLeftover = async (uniquekeys: Set<string>, type: string) => {
  for (const id of uniquekeys) {
    const matchingKeys = await redis.keys(`${type}:${id}:*`);
    if (matchingKeys.length <= 1) {
      await redis.del(`${type}:${id}:increment`);
    }
  }
};

