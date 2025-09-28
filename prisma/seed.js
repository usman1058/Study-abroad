// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // --- Users ---
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  })

  // --- Universities ---
  const oxford = await prisma.university.create({
    data: {
      name: 'University of Oxford',
      country: 'UK',
      description: 'A prestigious university in the UK.',
      duration: '3-4 years',
      tuitionFee: '£30,000',
      applicationFee: '£60',
      studyMode: 'Full-time',
      englishTest: 'IELTS/TOEFL',
      website: 'https://www.ox.ac.uk',
      featured: true,
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Oxford_University_Coat_Of_Arms.svg',
      courses: {
        create: [
          {
            title: 'Computer Science BSc',
            description: 'Learn algorithms, AI, and software engineering.',
            degreeType: 'bachelor',
            duration: '3 years',
            tuitionFee: '£30,000',
            requirements: 'High school diploma, IELTS',
            country: 'uk',
            featured: true,
          },
          {
            title: 'MBA',
            description: 'Master of Business Administration',
            degreeType: 'master',
            duration: '1 year',
            tuitionFee: '£50,000',
            requirements: 'Bachelor’s degree, GMAT, IELTS',
            country: 'uk',
          },
        ],
      },
    },
  })

  // --- Testimonials ---
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Alice Johnson',
        content: 'Studying abroad changed my life!',
        role: 'Student',
        company: 'University of Oxford',
      },
      {
        name: 'Mark Lee',
        content: 'Amazing support from the agency throughout the process.',
        role: 'Parent',
        company: null,
      },
    ],
  })

  // --- Newsletter ---
  await prisma.newsletter.createMany({
    data: [
      { email: 'subscriber1@example.com', name: 'Jane' },
      { email: 'subscriber2@example.com', name: 'Mike' },
    ],
  })

  // --- Blogs ---
  await prisma.blog.createMany({
    data: [
      {
        title: 'How to Apply for UK Universities',
        slug: 'apply-uk-universities',
        content: 'Step-by-step guide to applying for UK universities...',
        excerpt: 'A complete guide for international students.',
        author: 'Admin User',
        published: true,
        tags: 'uk,application,guide',
      },
      {
        title: 'Top Scholarships in Italy',
        slug: 'scholarships-italy',
        content: 'Explore top scholarships available for students in Italy...',
        excerpt: 'Save money with these scholarships.',
        author: 'John Doe',
        published: true,
        tags: 'italy,scholarships',
      },
    ],
  })

  // --- Lucky Draw Entries ---
  await prisma.luckyDrawEntry.create({
    data: {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '+44 123456789',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      userId: user.id,
      prize: 'Amazon Gift Card',
      isWinner: true,
    },
  })

  console.log('✅ Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
