import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const name = String(fd.get("name") || "").trim();
    if (!name) return NextResponse.json({ error: "课程名称不能为空" }, { status: 400 });

    const course = await prisma.course.create({
      data: {
        name,
        code: String(fd.get("code") || "") || null,
        instructor: String(fd.get("instructor") || "") || null,
        semester: String(fd.get("semester") || "") || null,
        accentColor: String(fd.get("accentColor") || "#3f5a3a"),
        description: String(fd.get("description") || "") || null
      }
    });
    return NextResponse.json(course);
  } catch (e) {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
