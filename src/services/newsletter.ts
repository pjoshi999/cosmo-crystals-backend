// import prisma from "../config/database";

// export const newsletterService = async (email: string) => {
//   const existingEmail = await prisma.newsletter.findUnique({
//     where: { email },
//   });
//   if (existingEmail) {
//     throw new Error("Email already subscribed");
//   }

//   const newEmail = await prisma.newsletter.create({
//     data: {
//       email,
//     },
//   });

//   return newEmail;
// };
