import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  try {
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.application.count({ where: { userId } }),
    ])

    return NextResponse.json({ applications, total, page, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const body = await request.json()
    const newApp = await prisma.application.create({
      data: {
        userId,
        companyName: body.companyName,
        positionTitle: body.positionTitle,
        jobUrl: body.jobUrl,
        companyWebsite: body.companyWebsite || '',
        companyLogoUrl: body.companyLogoUrl || '',
        companyMotto: body.companyMotto || '',
        status: body.status || 'APPLIED',
        resumeLink: body.resumeLink || '',
        coverLetterLink: body.coverLetterLink || '',
        interviewNotes: body.interviewNotes || '',
        feedbackNotes: body.feedbackNotes || '',
      },
    })
    return NextResponse.json(newApp, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create application record' }, { status: 500 })
  }
}