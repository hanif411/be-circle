import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const THREADS_TO_CREATE = 10000;
const DUMMY_USER_ID = 3;
const DUMMY_IMAGE_URL =
  "https://img.harianjogja.com/posts/2022/08/15/1108951/img_20210914_145900.jpg";


async function main() {
  console.log(`--- Memulai Seeding: ${THREADS_TO_CREATE} Threads ---`);


  const user = await prisma.users.findUnique({ where: { id: DUMMY_USER_ID } });

  if (!user) {
    console.error(
      `❌ Gagal: User dengan ID ${DUMMY_USER_ID} tidak ditemukan. Pastikan user ini ada.`
    );
    return;
  }


  const threadData = [];
  for (let i = 1; i <= THREADS_TO_CREATE; i++) {
    threadData.push({
      content: `Thread #${i} (Uji K6): Ini adalah postingan performa ke-${i} dari user ${user.full_name}.`,
      image: i % 10 === 0 ? DUMMY_IMAGE_URL : null,
      created_by: DUMMY_USER_ID,
      updated_by: DUMMY_USER_ID,
    });
  }

  console.log(
    `Membuat ${THREADS_TO_CREATE} thread melalui prisma.threads.createMany...`
  );
  const startTime = Date.now();

  const result = await prisma.threads.createMany({
    data: threadData,
    skipDuplicates: true,
  });

  const endTime = Date.now();

  console.log(`\n✅ Seeding selesai.`);
  console.log(`   Total Threads dibuat: ${result.count}`);
  console.log(
    `   Waktu eksekusi: ${((endTime - startTime) / 1000).toFixed(2)} detik`
  );
}

main()
  .catch((e) => {
    console.error("Seeding gagal:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });