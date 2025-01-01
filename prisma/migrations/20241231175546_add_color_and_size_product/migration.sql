-- CreateTable
CREATE TABLE "Color" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Size" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ColorsOnProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colorId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "stock" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ColorsOnProducts_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ColorsOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductsOnSizes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sizeId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "stock" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ProductsOnSizes_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductsOnSizes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ColorsOnProducts_colorId_productId_key" ON "ColorsOnProducts"("colorId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductsOnSizes_sizeId_productId_key" ON "ProductsOnSizes"("sizeId", "productId");
