import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { PrismaClient } from "../../src/generated/prisma/client.js";
import FileService from "../../src/services/file/FileService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type PictogramEntry = {
  // Term directory under assets/boards, holding pictogram.png and signwriting.png
  path: string;
  description: string;
  uuid: string;
};

export const PICTOGRAM_FILES: PictogramEntry[] = [
  // Exclusive representatives (not included in board pictogram lists)
  {
    path: "body-parts/body",
    description: "Corpo",
    uuid: "144705f7-1f6f-4260-b2d7-4db9ccddabb8",
  },
  {
    path: "general-symptoms/malaise",
    description: "Mal-Estar",
    uuid: "99b570da-8f1f-409a-9dc9-c8914a2cd900",
  },
  // Basic Needs
  {
    path: "basic-needs/water",
    description: "Água",
    uuid: "8f1cb8c0-33fa-4dcf-ba16-74f0fc72db4e",
  },
  {
    path: "basic-needs/food",
    description: "Comida",
    uuid: "6650c5ab-c3f0-41e9-b9bc-150bc22ee942",
  },
  {
    path: "basic-needs/bathroom",
    description: "Banheiro",
    uuid: "ec4d11e0-46da-4b17-aef6-fa9de793ebd8",
  },
  {
    path: "basic-needs/sleep",
    description: "Sono",
    uuid: "6a5b8142-3ffe-448d-a5ac-1fc2790faad3",
  },
  {
    path: "basic-needs/rest",
    description: "Descanso",
    uuid: "8cf2ccef-68e2-468e-a7d4-a1d6ff010839",
  },
  // Emotions and State
  {
    path: "emotions-and-state/happy",
    description: "Feliz",
    uuid: "0e924686-d36e-4ec3-8349-a04e067f83ed",
  },
  {
    path: "emotions-and-state/sad",
    description: "Triste",
    uuid: "79640a6d-abfb-4cf5-b4ba-7bcdc20a6a6a",
  },
  {
    path: "emotions-and-state/afraid",
    description: "Com Medo",
    uuid: "ad3a52aa-cc8a-4794-aa78-47d83716ab96",
  },
  {
    path: "emotions-and-state/irritated",
    description: "Irritado",
    uuid: "44860c8f-1732-4494-84b3-b7cdacf4629a",
  },
  {
    path: "emotions-and-state/anxious",
    description: "Ansioso",
    uuid: "0b711353-ea84-40f9-b4ee-450db0a67692",
  },
  {
    path: "emotions-and-state/calm",
    description: "Calmo",
    uuid: "8d233177-2f1e-4b1e-b2ce-06dfb5383a38",
  },
  {
    path: "emotions-and-state/confused",
    description: "Confuso",
    uuid: "870ea3c4-f595-4cc7-a61e-caafd216bbf2",
  },
  // Body Parts
  {
    path: "body-parts/head",
    description: "Cabeça",
    uuid: "f55a4706-5c57-433f-a022-7abfe781fb1a",
  },
  {
    path: "body-parts/eyes",
    description: "Olhos",
    uuid: "ae62e148-7f8a-4d31-b559-dfb69f04e293",
  },
  {
    path: "body-parts/ear",
    description: "Ouvidos",
    uuid: "8e7064fa-183e-410f-8b9e-fd6057257070",
  },
  {
    path: "body-parts/nose",
    description: "Nariz",
    uuid: "53a111bc-7447-41d0-a819-fba51de638ba",
  },
  {
    path: "body-parts/mouth",
    description: "Boca",
    uuid: "1a02261b-61f7-4477-97fc-e7ac04b2e15a",
  },
  {
    path: "body-parts/tooth",
    description: "Dente",
    uuid: "c226bcc3-a6ea-498c-b229-f122efa1ded8",
  },
  {
    path: "body-parts/throat",
    description: "Garganta",
    uuid: "ebd11386-6a8c-416b-aeab-3332764b4706",
  },
  {
    path: "body-parts/lung",
    description: "Peito / Pulmão",
    uuid: "96bc5b14-102e-476f-9d23-015227717ceb",
  },
  {
    path: "body-parts/heart",
    description: "Coração",
    uuid: "115de064-0766-41fd-bb1f-bb4990cb031e",
  },
  {
    path: "body-parts/belly",
    description: "Barriga",
    uuid: "723c9f9f-89bd-48e1-b237-07d3546618a4",
  },
  {
    path: "body-parts/arm",
    description: "Braço",
    uuid: "d41d4bf9-193d-4b20-91ab-f5752e5eb7e2",
  },
  {
    path: "body-parts/leg",
    description: "Perna",
    uuid: "6f825fab-26b2-44b9-862a-74bc1c2ccfdb",
  },
  {
    path: "body-parts/foot",
    description: "Pé",
    uuid: "424fdefb-18cd-4645-b8ce-a66d2e0e5250",
  },
  {
    path: "body-parts/back",
    description: "Costas",
    uuid: "9ad5f99f-375d-4e75-a967-ce757dc1317e",
  },
  // General Symptoms
  {
    path: "general-symptoms/nausea",
    description: "Náusea",
    uuid: "4bdec2c8-170b-4f5b-85a0-7adc4c311c1e",
  },
  {
    path: "general-symptoms/dizziness",
    description: "Tontura",
    uuid: "a36ab6c8-3da5-46c2-8390-9f73675b8e5b",
  },
  {
    path: "general-symptoms/shortness-of-breath",
    description: "Falta de Ar",
    uuid: "75cb847b-9c76-45cb-9f70-5d0a2f72398f",
  },
  {
    path: "general-symptoms/fatigue",
    description: "Cansaço",
    uuid: "2817a8f9-c558-46a4-8230-4c0399333da2",
  },
  {
    path: "general-symptoms/fever",
    description: "Febre",
    uuid: "dc9a3a35-a2d1-4313-a366-3b885688f3fa",
  },
  {
    path: "general-symptoms/tingling",
    description: "Formigamento",
    uuid: "03648046-6607-4e16-adee-c2c93c9c1fa9",
  },
];

export async function seedPictograms(prisma: PrismaClient): Promise<void> {
  const fileService = new FileService();

  for (const entry of PICTOGRAM_FILES) {
    const assetPath = path.join(
      __dirname,
      "../assets/boards",
      entry.path,
      "pictogram.png",
    );
    const buffer = await fs.readFile(assetPath);
    const stats = await fs.stat(assetPath);
    const filename = `${path.basename(entry.path)}.png`;

    const result = await fileService.save(
      {
        buffer,
        filename,
        originalName: filename,
        fileSize: stats.size,
        mimeType: "image/png",
      },
      entry.uuid,
    );

    await prisma.storedFile.upsert({
      where: { uuid: entry.uuid },
      update: {},
      create: {
        uuid: entry.uuid,
        location: result.location,
        filename: result.filename,
        originalName: filename,
        fileSize: BigInt(stats.size),
        mimeType: "image/png",
        fileType: "image",
        purpose: "pictogram",
        isPrivate: false,
      },
    });

    const storedFile = await prisma.storedFile.findUniqueOrThrow({
      where: { uuid: entry.uuid },
    });

    await prisma.pictogram.upsert({
      where: { storedFileId: storedFile.id },
      update: {},
      create: {
        description: entry.description,
        storedFileId: storedFile.id,
      },
    });
  }
}
