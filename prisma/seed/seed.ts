import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@studyabroad.com' },
    update: {},
    create: {
      email: 'admin@studyabroad.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    },
  })

  // Create sample universities
  const universities = [
    {
      name: 'University of Bologna',
      country: 'Italy',
      description: 'The oldest university in the world, offering comprehensive programs in arts, sciences, and professional studies.',
      duration: '2 years',
      tuitionFee: '€2,000 - €4,000 per year',
      applicationFee: '€50',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.0',
      website: 'https://www.unibo.it',
      featured: true,
    },
    {
      name: 'Sapienza University of Rome',
      country: 'Italy',
      description: 'One of the largest and most prestigious universities in Italy, known for research and innovation.',
      duration: '2 years',
      tuitionFee: '€1,000 - €3,000 per year',
      applicationFee: '€30',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.5',
      website: 'https://www.uniroma1.it',
      featured: true,
    },
    {
      name: 'Politecnico di Milano',
      country: 'Italy',
      description: 'Leading technical university specializing in engineering, architecture, and design.',
      duration: '2 years',
      tuitionFee: '€3,900 - €4,200 per year',
      applicationFee: '€50',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.0',
      website: 'https://www.polimi.it',
      featured: false,
    },
    {
      name: 'Technical University of Munich',
      country: 'Germany',
      description: 'One of Germany\'s top universities, excellence in engineering and natural sciences.',
      duration: '2 years',
      tuitionFee: 'Free (semester fee: €129)',
      applicationFee: '€75',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.5',
      website: 'https://www.tum.de',
      featured: true,
    },
    {
      name: 'Ludwig Maximilian University of Munich',
      country: 'Germany',
      description: 'Premier research university with a wide range of programs in humanities and sciences.',
      duration: '2 years',
      tuitionFee: 'Free (semester fee: €129)',
      applicationFee: '€60',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.0',
      website: 'https://www.lmu.de',
      featured: true,
    },
    {
      name: 'Heidelberg University',
      country: 'Germany',
      description: 'Germany\'s oldest university, renowned for research and academic excellence.',
      duration: '2 years',
      tuitionFee: 'Free (semester fee: €159)',
      applicationFee: '€75',
      studyMode: 'Full-time',
      englishTest: 'IELTS 6.5',
      website: 'https://www.uni-heidelberg.de',
      featured: false,
    },
  ]

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { 
        name_country: {
          name: uni.name,
          country: uni.country
        }
      },
      update: {},
      create: uni,
    })
  }

  // Create sample testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      content: 'The guidance I received was exceptional. From university selection to visa application, every step was handled professionally. I\'m now studying at my dream university in Italy!',
      role: 'Computer Science Student',
      company: 'University of Bologna',
      active: true,
    },
    {
      name: 'Michael Chen',
      content: 'I was overwhelmed with the application process, but my mentor made it seamless. Their expertise in German universities helped me secure admission to TUM.',
      role: 'Engineering Student',
      company: 'Technical University of Munich',
      active: true,
    },
    {
      name: 'Emma Williams',
      content: 'Personalized attention and deep knowledge of European education systems made all the difference. Highly recommend their services!',
      role: 'Business Student',
      company: 'Sapienza University of Rome',
      active: true,
    },
    {
      name: 'David Rodriguez',
      content: 'The mentorship I received was invaluable. They helped me choose the right program and guided me through the entire application process.',
      role: 'Design Student',
      company: 'Politecnico di Milano',
      active: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { 
        name_content: {
          name: testimonial.name,
          content: testimonial.content
        }
      },
      update: {},
      create: testimonial,
    })
  }

  // Create sample lucky draw entries
  const luckyDrawEntries = [
    {
      name: 'Alice Smith',
      email: 'alice.smith@email.com',
      phone: '+1234567890',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      phone: '+1234567891',
    },
    {
      name: 'Carol Williams',
      email: 'carol.williams@email.com',
      phone: '+1234567892',
    },
    {
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1234567893',
    },
    {
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1234567894',
    },
  ]

  for (const entry of luckyDrawEntries) {
    await prisma.luckyDrawEntry.upsert({
      where: { 
        email_phone: {
          email: entry.email,
          phone: entry.phone
        }
      },
      update: {},
      create: entry,
    })
  }

  // Create sample contact submissions
  const contactSubmissions = [
    {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      education: 'Bachelor\'s Degree',
      countryToGo: 'Germany',
      budget: 'Under $20,000',
      timeline: 'Medium (6–12 months)',
      message: 'I\'m interested in pursuing a Master\'s degree in Computer Science in Germany. Could you please guide me through the application process?',
      sourcePage: 'contact',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1234567891',
      education: 'High School',
      countryToGo: 'Italy',
      budget: '$20,000–$30,000',
      timeline: 'Soon (3–6 months)',
      message: 'I want to study architecture in Italy. What are the best universities and what are the admission requirements?',
      sourcePage: 'study-in-italy',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    {
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1234567892',
      education: 'Master\'s',
      countryToGo: 'United Kingdom',
      budget: '$30,000–$40,000',
      timeline: 'Immediate (Next 3 months)',
      message: 'Looking for PhD opportunities in Engineering. Need guidance on university selection and funding options.',
      sourcePage: 'contact',
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    },
  ]

  for (const submission of contactSubmissions) {
    await prisma.contactSubmission.upsert({
      where: { 
        email_createdAt: {
          email: submission.email,
          createdAt: new Date()
        }
      },
      update: {},
      create: submission,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('📊 Summary:')
  console.log(`   - Admin user: ${adminUser.email}`)
  console.log(`   - Universities: ${universities.length}`)
  console.log(`   - Testimonials: ${testimonials.length}`)
  console.log(`   - Lucky draw entries: ${luckyDrawEntries.length}`)
  console.log(`   - Contact submissions: ${contactSubmissions.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })