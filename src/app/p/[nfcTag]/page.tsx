import { Metadata, Viewport } from 'next'
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import EmployeeProfileClient from "./EmployeeProfileClient"

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ nfcTag: string }> }): Promise<Metadata> {
    const { nfcTag } = await params

    const employee = await prisma.enterpriseEmployee.findFirst({
        where: { OR: [{ nfcTag }, { id: nfcTag }] },
        include: {
            profile: {
                include: { user: true }
            }
        }
    })

    if (!employee) return { title: 'Personel Bulunamadı | Kardly' }

    const companyName = employee.profile?.user?.name || 'Kardly Kurumsal'
    const title = `${employee.name} - ${employee.role || 'Personel'} | ${companyName}`
    const description = `${companyName} bünyesinde ${employee.department || 'Genel'} departmanında çalışan ${employee.name} kişisine ait kurumsal dijital kartvizit.`
    const image = employee.photo || employee.profile?.profileBgImage || '/og-placeholder.png'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image }],
            type: 'profile',
            siteName: companyName,
        }
    }
}

export async function generateViewport(): Promise<Viewport> {
    return {
        themeColor: '#0f172a',
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    }
}

export default async function EmployeePage({ params }: { params: Promise<{ nfcTag: string }> }) {
    const { nfcTag } = await params

    const employee = await prisma.enterpriseEmployee.findFirst({
        where: { OR: [{ nfcTag }, { id: nfcTag }] },
        include: {
            profile: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            }
        }
    })

    if (!employee || !employee.active) {
        return notFound()
    }

    const serializedEmployee = JSON.parse(JSON.stringify(employee))

    return <EmployeeProfileClient employee={serializedEmployee} />
}
