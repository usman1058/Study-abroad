import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminUser = await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    },
  })

  console.log('Admin user created/updated:', adminUser.email)

  // Create sample universities
  const universities = [
    {
      name: 'University of Bologna',
      country: 'Italy',
      description: 'The oldest university in the world, offering excellent programs in various fields.',
      duration: '2 years',
      tuitionFee: '€2,000/year',
      applicationFee: '€50',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.0',
      website: 'https://www.unibo.it',
      featured: true,
    },
    {
      name: 'Sapienza University of Rome',
      country: 'Italy',
      description: 'One of the largest universities in Europe, known for research and innovation.',
      duration: '2 years',
      tuitionFee: '€3,000/year',
      applicationFee: '€60',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.5',
      website: 'https://www.uniroma1.it',
      featured: true,
    },
    {
      name: 'Technical University of Munich',
      country: 'Germany',
      description: 'Leading technical university in Germany, excellence in engineering and technology.',
      duration: '2 years',
      tuitionFee: 'Free (semester fee: €150)',
      applicationFee: '€75',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.5',
      website: 'https://www.tum.de',
      featured: true,
    },
    {
      name: 'Ludwig Maximilian University of Munich',
      country: 'Germany',
      description: 'Prestigious research university with strong programs in sciences and humanities.',
      duration: '2 years',
      tuitionFee: 'Free (semester fee: €150)',
      applicationFee: '€60',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.0',
      website: 'https://www.lmu.de',
      featured: false,
    },
    {
      name: 'Humboldt University of Berlin',
      country: 'Germany',
      description: 'Historic university known for humanities and social sciences.',
      duration: '2 years',
      tuitionFee: 'Free (semester fee: €300)',
      applicationFee: '€50',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.0',
      website: 'https://www.hu-berlin.de',
      featured: false,
    },
  ]

  for (const uni of universities) {
    const university = await db.university.create({
      data: uni,
    })
    console.log('University created:', university.name)
  }

  // Create sample testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      content: 'The mentorship I received was exceptional. They helped me navigate the complex application process and I got accepted into my dream university in Italy!',
      role: 'Master\'s Student',
      company: 'University of Bologna',
      active: true,
    },
    {
      name: 'Michael Chen',
      content: 'Thanks to the personalized guidance, I was able to secure admission to TUM with a scholarship. The support was invaluable.',
      role: 'Engineering Student',
      company: 'Technical University of Munich',
      active: true,
    },
    {
      name: 'Emma Williams',
      content: 'From choosing the right program to visa assistance, every step was handled professionally. Highly recommend their services!',
      role: 'Bachelor\'s Student',
      company: 'Sapienza University of Rome',
      active: true,
    },
  ]

  for (const testimonial of testimonials) {
    const createdTestimonial = await db.testimonial.create({
      data: testimonial,
    })
    console.log('Testimonial created:', createdTestimonial.name)
  }

  // Create sample lucky draw entries
  const luckyDrawEntries = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      isWinner: false,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      ipAddress: '192.168.1.11',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      isWinner: false,
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      ipAddress: '192.168.1.12',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36',
      isWinner: true,
      drawDate: new Date(),
      prize: 'Free Consultation',
      notified: true,
    },
  ]

  for (const entry of luckyDrawEntries) {
    const createdEntry = await db.luckyDrawEntry.create({
      data: entry,
    })
    console.log('Lucky draw entry created:', createdEntry.name)
  }

  // Create sample contact submissions
  const contactSubmissions = [
    {
      name: 'Alice Cooper',
      email: 'alice@example.com',
      phone: '+1234567893',
      education: 'Bachelor\'s Degree',
      countryToGo: 'Italy',
      budget: '$20,000–$30,000',
      timeline: 'Medium (6–12 months)',
      message: 'I am interested in pursuing a Master\'s degree in Computer Science in Italy. Please help me find suitable universities.',
      sourcePage: 'contact',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      processed: false,
    },
    {
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1234567894',
      education: 'High School',
      countryToGo: 'Germany',
      budget: 'Under $20,000',
      timeline: 'Long (1+ year)',
      message: 'I want to study engineering in Germany. Can you guide me through the application process?',
      sourcePage: 'study-in-uk',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      processed: true,
    },
  ]

  for (const submission of contactSubmissions) {
    const createdSubmission = await db.contactSubmission.create({
      data: submission,
    })
    console.log('Contact submission created:', createdSubmission.name)
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })