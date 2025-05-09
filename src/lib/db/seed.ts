import data from "@/lib/data";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";
import { connectToDatabase } from ".";
import Product from "./models/product.model";
import Review from "./models/review.model";
import User from "./models/user.model";

loadEnvConfig(cwd());

const main = async () => {
  try {
    const { products, users, reviews } = data;
    await connectToDatabase(process.env.MONGODB_URI);

    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    const createdUser = await User.insertMany(users);
    const createdProducts = await Product.insertMany(products);
    const rws = [];
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0;
      const { ratingDistribution } = createdProducts[i];
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++;
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: createdUser[x % createdUser.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          });
        }
      }
    }

    const createdReviews = await Review.insertMany(rws);

    console.log({
      createdProducts,
      createdUser,
      createdReviews,
      message: "Seeded database successfully",
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
