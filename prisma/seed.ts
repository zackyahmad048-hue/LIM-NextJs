// prisma/seed.ts
import { PrismaClient, Role, AccountType } from '@/generated/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Helper function untuk membuat user dengan Better Auth
  async function seedUser(
    email: string,
    name: string,
    role: Role,
    accountType: AccountType,
    password: string
  ) {
    try {
      await auth.api.signUpEmail({ body: { email, name, password } })
      await prisma.user.update({
        where: { email },
        data: { role, accountType, emailVerified: true },
      })
      console.log(`✅ Created User: ${email} (${role})`)
    } catch (error: unknown) {
      // Type guard: Pastikan error adalah objek Error sebelum akses .message
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log(`⏭️  User already exists: ${email}`)
      } else {
        throw error
      }
    }
  }

  // 1. Buat User Owner & Admin
  await seedUser('owner@lim.or.id', 'Super Admin LIM', 'OWNER', 'PERSONAL', 'owner123')
  await seedUser('admin@lim.or.id', 'Admin Sekretariat', 'ADMIN_SEKRETARIAT', 'PERSONAL', 'admin123')

  // 2. Ambil atau Buat Periode Khidmat
  let periode = await prisma.periodeKhidmat.findFirst({
    where: { namaPeriode: 'Khidmat 2024-2029' }
  })

  if (!periode) {
    periode = await prisma.periodeKhidmat.create({
      data: {
        namaPeriode: 'Khidmat 2024-2029',
        tahunMulai: 2024,
        tahunSelesai: 2029,
        isActive: true,
      }
    })
    console.log(`✅ Created Periode Khidmat with ID: ${periode.id}`)
  } else {
    console.log(`⏭️  Periode Khidmat already exists. ID: ${periode.id}`)
  }

  // 3. Pastikan Unit Organisasi (PP) ada
  await prisma.unitOrganisasi.upsert({
    where: { levelCode: 'PP' },
    update: {},
    create: {
      namaUnit: 'Pengurus Pusat LIM',
      levelCode: 'PP',
      wilayah: 'Pusat',
    },
  })
  console.log('✅ Created Unit Organisasi: PP')

  // 4. Pastikan LetterPeriod ada (Relasi yang benar untuk LetterNumberCounter)
  let letterPeriod = await prisma.letterPeriod.findFirst({
    where: { periodId: periode.id }
  })

  if (!letterPeriod) {
    letterPeriod = await prisma.letterPeriod.create({
      data: {
        periodId: periode.id,
        namaPeriode: periode.namaPeriode,
        tahunMulai: periode.tahunMulai,
        tahunSelesai: periode.tahunSelesai,
        isActive: periode.isActive,
      }
    })
    console.log(`✅ Created LetterPeriod with ID: ${letterPeriod.id}`)
  } else {
    console.log(`⏭️  LetterPeriod already exists: ${letterPeriod.id}`)
  }

  // 5. 🔑 BUAT LETTER NUMBER COUNTER
  console.log('🔍 Membersihkan data LetterNumberCounter yang lama/korup...')
  await prisma.letterNumberCounter.deleteMany()

  try {
    console.log(`🔍 Verifying if LetterPeriod ID "${letterPeriod.id}" exists...`)
    const verifiedPeriod = await prisma.letterPeriod.findUnique({
      where: { id: letterPeriod.id }
    })

    if (!verifiedPeriod) {
      throw new Error(`CRITICAL: LetterPeriod with ID "${letterPeriod.id}" DOES NOT exist!`)
    }
    console.log(`✅ Verified: LetterPeriod ID "${letterPeriod.id}" is valid.`)

    await prisma.letterNumberCounter.create({
      data: {
        period: {
          connect: { id: letterPeriod.id }
        },
        levelCode: 'PP',
        categoryCode: 'H',
        currentSeq: 0,
      },
    })
    console.log(`✅ Created Letter Number Counter for LetterPeriod ID: ${letterPeriod.id}`)
  } catch (error: unknown) {
    console.error('\n❌ Gagal membuat Letter Number Counter.')
    
    // Ekstrak pesan error dengan aman tanpa menggunakan 'any'
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Detail Error:', errorMessage)
    
    throw error
  }

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Test Credentials:')
  console.log('   Owner: owner@lim.or.id / owner123')
  console.log('   Admin: admin@lim.or.id / admin123')
}

main()
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ Seed failed:', errorMessage)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })