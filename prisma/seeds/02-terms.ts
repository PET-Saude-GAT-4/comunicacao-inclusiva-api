import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { PrismaClient } from "../../src/generated/prisma/client.js";
import FileService from "../../src/services/file/FileService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type TermEntry = {
  // Term directory under assets/boards, holding pictogram.png and signwriting.png
  path: string;
  description: string;
  pictogramFileUuid: string;
  signWritingFileUuid: string;
};

export const TERM_FILES: TermEntry[] = [
  // Exclusive representatives (not included in board term lists)
  {
    path: "body-parts/body",
    description: "Corpo",
    pictogramFileUuid: "144705f7-1f6f-4260-b2d7-4db9ccddabb8",
    signWritingFileUuid: "ca461c6d-e765-4735-a744-4c21b8104067",
  },
  {
    path: "general-symptoms/malaise",
    description: "Mal-Estar",
    pictogramFileUuid: "99b570da-8f1f-409a-9dc9-c8914a2cd900",
    signWritingFileUuid: "ac84fbc4-b5a8-4524-afbc-956b26118104",
  },
  // Basic Needs
  {
    path: "basic-needs/water",
    description: "Água",
    pictogramFileUuid: "8f1cb8c0-33fa-4dcf-ba16-74f0fc72db4e",
    signWritingFileUuid: "fa85a7ec-ff5b-4578-9d51-6651f48fb40c",
  },
  {
    path: "basic-needs/food",
    description: "Comida",
    pictogramFileUuid: "6650c5ab-c3f0-41e9-b9bc-150bc22ee942",
    signWritingFileUuid: "a70904c9-2497-4ea0-9b6d-59949a3c376d",
  },
  {
    path: "basic-needs/bathroom",
    description: "Banheiro",
    pictogramFileUuid: "ec4d11e0-46da-4b17-aef6-fa9de793ebd8",
    signWritingFileUuid: "b28acf98-adb5-4708-b67c-ffa809ce05c6",
  },
  {
    path: "basic-needs/sleep",
    description: "Sono",
    pictogramFileUuid: "6a5b8142-3ffe-448d-a5ac-1fc2790faad3",
    signWritingFileUuid: "7a5a4e09-d93a-45a6-afed-7f6a0274d878",
  },
  {
    path: "basic-needs/rest",
    description: "Descanso",
    pictogramFileUuid: "8cf2ccef-68e2-468e-a7d4-a1d6ff010839",
    signWritingFileUuid: "2d1337d0-9502-4a3f-ab8c-c5a250680e6f",
  },
  // Emotions and State
  {
    path: "emotions-and-state/happy",
    description: "Feliz",
    pictogramFileUuid: "0e924686-d36e-4ec3-8349-a04e067f83ed",
    signWritingFileUuid: "c1ebc7ca-f08b-4490-a4f8-0ee0977a75be",
  },
  {
    path: "emotions-and-state/sad",
    description: "Triste",
    pictogramFileUuid: "79640a6d-abfb-4cf5-b4ba-7bcdc20a6a6a",
    signWritingFileUuid: "ab7c3803-cfe8-46e6-88ec-19907847181e",
  },
  {
    path: "emotions-and-state/afraid",
    description: "Com Medo",
    pictogramFileUuid: "ad3a52aa-cc8a-4794-aa78-47d83716ab96",
    signWritingFileUuid: "091f15c3-bfcc-4218-a37f-a7510911b5ca",
  },
  {
    path: "emotions-and-state/irritated",
    description: "Irritado",
    pictogramFileUuid: "44860c8f-1732-4494-84b3-b7cdacf4629a",
    signWritingFileUuid: "8d45f33e-e54f-47c5-a660-09cd31d685e5",
  },
  {
    path: "emotions-and-state/anxious",
    description: "Ansioso",
    pictogramFileUuid: "0b711353-ea84-40f9-b4ee-450db0a67692",
    signWritingFileUuid: "4e10e28d-534e-48e2-92f7-84a7eb5c73aa",
  },
  {
    path: "emotions-and-state/calm",
    description: "Calmo",
    pictogramFileUuid: "8d233177-2f1e-4b1e-b2ce-06dfb5383a38",
    signWritingFileUuid: "5277de71-5f96-4ceb-a86a-78e77a02ce86",
  },
  {
    path: "emotions-and-state/confused",
    description: "Confuso",
    pictogramFileUuid: "870ea3c4-f595-4cc7-a61e-caafd216bbf2",
    signWritingFileUuid: "3b279bff-a028-4bb7-9d33-bce9037b6f20",
  },
  // Body Parts
  {
    path: "body-parts/head",
    description: "Cabeça",
    pictogramFileUuid: "f55a4706-5c57-433f-a022-7abfe781fb1a",
    signWritingFileUuid: "6270c84d-1471-4425-8d36-547ba2458dad",
  },
  {
    path: "body-parts/eyes",
    description: "Olhos",
    pictogramFileUuid: "ae62e148-7f8a-4d31-b559-dfb69f04e293",
    signWritingFileUuid: "5b51f2aa-ac5a-46ba-a6e7-d38e7ee0ae59",
  },
  {
    path: "body-parts/ear",
    description: "Ouvidos",
    pictogramFileUuid: "8e7064fa-183e-410f-8b9e-fd6057257070",
    signWritingFileUuid: "f637f866-3f87-4ff8-a83e-3bc6ad2056c9",
  },
  {
    path: "body-parts/nose",
    description: "Nariz",
    pictogramFileUuid: "53a111bc-7447-41d0-a819-fba51de638ba",
    signWritingFileUuid: "ad924e51-6c11-4b67-8a95-02433c73d0d0",
  },
  {
    path: "body-parts/mouth",
    description: "Boca",
    pictogramFileUuid: "1a02261b-61f7-4477-97fc-e7ac04b2e15a",
    signWritingFileUuid: "99a916ac-1e62-4f6e-8afd-e0a77aded15d",
  },
  {
    path: "body-parts/tooth",
    description: "Dente",
    pictogramFileUuid: "c226bcc3-a6ea-498c-b229-f122efa1ded8",
    signWritingFileUuid: "0e4d16b2-d881-4fe5-830c-cff25c310604",
  },
  {
    path: "body-parts/throat",
    description: "Garganta",
    pictogramFileUuid: "ebd11386-6a8c-416b-aeab-3332764b4706",
    signWritingFileUuid: "fc66000c-98ba-4774-a1f6-6512b7da3673",
  },
  {
    path: "body-parts/lung",
    description: "Peito / Pulmão",
    pictogramFileUuid: "96bc5b14-102e-476f-9d23-015227717ceb",
    signWritingFileUuid: "98b4a8b1-1982-4e1f-b1b9-5b7deeba7a25",
  },
  {
    path: "body-parts/heart",
    description: "Coração",
    pictogramFileUuid: "115de064-0766-41fd-bb1f-bb4990cb031e",
    signWritingFileUuid: "f90ea377-c8de-419f-a7c4-1752f7a3bd59",
  },
  {
    path: "body-parts/belly",
    description: "Barriga",
    pictogramFileUuid: "723c9f9f-89bd-48e1-b237-07d3546618a4",
    signWritingFileUuid: "4e354a43-cb48-49f3-b75a-1a485fe9f8f9",
  },
  {
    path: "body-parts/arm",
    description: "Braço",
    pictogramFileUuid: "d41d4bf9-193d-4b20-91ab-f5752e5eb7e2",
    signWritingFileUuid: "bbb0124a-75a7-4658-a33b-80a309443efb",
  },
  {
    path: "body-parts/leg",
    description: "Perna",
    pictogramFileUuid: "6f825fab-26b2-44b9-862a-74bc1c2ccfdb",
    signWritingFileUuid: "e9c99e1f-12d6-4699-b9bc-1255e83daa5c",
  },
  {
    path: "body-parts/foot",
    description: "Pé",
    pictogramFileUuid: "424fdefb-18cd-4645-b8ce-a66d2e0e5250",
    signWritingFileUuid: "62730492-255d-4ca0-94e5-fc989911f6de",
  },
  {
    path: "body-parts/back",
    description: "Costas",
    pictogramFileUuid: "9ad5f99f-375d-4e75-a967-ce757dc1317e",
    signWritingFileUuid: "284a2537-2938-483d-ac81-641eeee24d96",
  },
  // General Symptoms
  {
    path: "general-symptoms/nausea",
    description: "Náusea",
    pictogramFileUuid: "4bdec2c8-170b-4f5b-85a0-7adc4c311c1e",
    signWritingFileUuid: "4ba60eda-fa01-4c97-8ae6-5706d3cc904f",
  },
  {
    path: "general-symptoms/dizziness",
    description: "Tontura",
    pictogramFileUuid: "a36ab6c8-3da5-46c2-8390-9f73675b8e5b",
    signWritingFileUuid: "e0fe1b65-a8b9-4d97-82fa-590edbe20646",
  },
  {
    path: "general-symptoms/shortness-of-breath",
    description: "Falta de Ar",
    pictogramFileUuid: "75cb847b-9c76-45cb-9f70-5d0a2f72398f",
    signWritingFileUuid: "b54facc5-cd41-4be4-8ab8-9e48126e571b",
  },
  {
    path: "general-symptoms/fatigue",
    description: "Cansaço",
    pictogramFileUuid: "2817a8f9-c558-46a4-8230-4c0399333da2",
    signWritingFileUuid: "414d3b02-afe0-48f7-b1c2-43e464db56fd",
  },
  {
    path: "general-symptoms/fever",
    description: "Febre",
    pictogramFileUuid: "dc9a3a35-a2d1-4313-a366-3b885688f3fa",
    signWritingFileUuid: "d5efff45-c1b9-4c2c-807d-e4c19391d220",
  },
  {
    path: "general-symptoms/tingling",
    description: "Formigamento",
    pictogramFileUuid: "03648046-6607-4e16-adee-c2c93c9c1fa9",
    signWritingFileUuid: "4b03676f-3a41-490d-858f-6744f3294d06",
  },
];

async function storeAsset(
  prisma: PrismaClient,
  fileService: FileService,
  entry: TermEntry,
  asset: "pictogram" | "signwriting",
  fileUuid: string,
  purpose: string,
  filename: string,
) {
  const assetPath = path.join(
    __dirname,
    "../assets/boards",
    entry.path,
    `${asset}.png`,
  );
  const buffer = await fs.readFile(assetPath);
  const stats = await fs.stat(assetPath);

  const result = await fileService.save(
    {
      buffer,
      filename,
      originalName: filename,
      fileSize: stats.size,
      mimeType: "image/png",
    },
    fileUuid,
  );

  await prisma.storedFile.upsert({
    where: { uuid: fileUuid },
    update: {},
    create: {
      uuid: fileUuid,
      location: result.location,
      filename: result.filename,
      originalName: filename,
      fileSize: BigInt(stats.size),
      mimeType: "image/png",
      fileType: "image",
      purpose,
      isPrivate: false,
    },
  });

  return prisma.storedFile.findUniqueOrThrow({ where: { uuid: fileUuid } });
}

export async function seedTerms(prisma: PrismaClient): Promise<void> {
  const fileService = new FileService();

  for (const entry of TERM_FILES) {
    const basename = path.basename(entry.path);

    const pictogramFile = await storeAsset(
      prisma,
      fileService,
      entry,
      "pictogram",
      entry.pictogramFileUuid,
      "pictogram",
      `${basename}.png`,
    );

    const signWritingFile = await storeAsset(
      prisma,
      fileService,
      entry,
      "signwriting",
      entry.signWritingFileUuid,
      "signwriting",
      `${basename}-signwriting.png`,
    );

    await prisma.pictogram.upsert({
      where: { storedFileId: pictogramFile.id },
      update: {},
      create: {
        description: entry.description,
        storedFileId: pictogramFile.id,
      },
    });

    await prisma.signWriting.upsert({
      where: { storedFileId: signWritingFile.id },
      update: {},
      create: {
        description: entry.description,
        storedFileId: signWritingFile.id,
      },
    });

    const pictogram = await prisma.pictogram.findUniqueOrThrow({
      where: { storedFileId: pictogramFile.id },
    });

    const signWriting = await prisma.signWriting.findUniqueOrThrow({
      where: { storedFileId: signWritingFile.id },
    });

    await prisma.term.upsert({
      where: {
        pictogramId_signWritingId: {
          pictogramId: pictogram.id,
          signWritingId: signWriting.id,
        },
      },
      update: {},
      create: {
        description: entry.description,
        pictogramId: pictogram.id,
        signWritingId: signWriting.id,
      },
    });
  }
}
