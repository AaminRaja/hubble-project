-- CreateTable
CREATE TABLE "shows" (
    "id" INTEGER NOT NULL,
    "show_name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibitors" (
    "id" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "country" TEXT,
    "square_logo" TEXT,
    "user_id" TEXT NOT NULL,
    "show_id" INTEGER NOT NULL,
    "exhibitor_type" TEXT,
    "sponsorship" TEXT,
    "booth_no" TEXT,
    "hall_no" TEXT,

    CONSTRAINT "exhibitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL,
    "main_category" TEXT NOT NULL,
    "category_type" TEXT NOT NULL,
    "product_category_type" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibitor_categories" (
    "exhibitor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "exhibitor_categories_pkey" PRIMARY KEY ("exhibitor_id","category_id")
);

-- CreateTable
CREATE TABLE "consult_submissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consult_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exhibitors_show_id_idx" ON "exhibitors"("show_id");

-- CreateIndex
CREATE INDEX "exhibitor_categories_category_id_idx" ON "exhibitor_categories"("category_id");

-- AddForeignKey
ALTER TABLE "exhibitors" ADD CONSTRAINT "exhibitors_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibitor_categories" ADD CONSTRAINT "exhibitor_categories_exhibitor_id_fkey" FOREIGN KEY ("exhibitor_id") REFERENCES "exhibitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibitor_categories" ADD CONSTRAINT "exhibitor_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
