import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
	{ name: 'Fashion' },
	{ name: 'Electronics' },
	{ name: 'Health & Beauty' },
	{ name: 'Sports' },
	{ name: 'Books' },
	{ name: 'Stationery' },
];

const colors = [
	{ name: 'black', bgColor: '#000000' },
	{ name: 'pink', bgColor: '#F0A8D0' },
	{ name: 'purple', bgColor: '#87A2FF' },
	{ name: 'white', bgColor: '#ffffff' },
	{ name: 'red', bgColor: '#D21312' },
	{ name: 'green', bgColor: '#03C988' },
];

const sizes = [
	{ name: 'XS' },
	{ name: 'S' },
	{ name: 'M' },
	{ name: 'L' },
	{ name: 'XL' },
	{ name: 'XXL' },
];

async function main() {
	console.log(`Start seeding ...`);
  
  for (const category of categories) {
    const createdCategory = await prisma.category.create({ data: category });
    console.log(`Created category with id: ${createdCategory.id}`);
  }

	for (const color of colors) {
		const createdColor = await prisma.color.create({ data: color });
		console.log(`Created color with id: ${createdColor.id}`);
	}

	for (const size of sizes) {
		const createdSize = await prisma.size.create({ data: size });
		console.log(`Created size with id: ${createdSize.id}`);
	}

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

// npx prisma db seed
