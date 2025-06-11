import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';

export async function DELETE(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] DELETE /api/proxy/delete-exam`);

  const url = request.nextUrl;
  const managementId = url.searchParams.get('management_id');

  if (!managementId) {
    return NextResponse.json(
      { error: "Missing exam ID" },
      { status: 400 }
    );
  }

  const id = Number(managementId);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json(
      { error: "Invalid exam ID - must be a positive integer", received: managementId },
      { status: 400 }
    );
  }
  try {
    // 确保连接已经建立
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const deleteResult = await AppDataSource.query(
      `DELETE FROM exam_management WHERE management_id = ?`,
      [id]
    );
    
    const affectedRows = deleteResult.affectedRows || 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Exam not found", id },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
      id
    });
  } catch (error: any) {
    console.error(error);
    // 错误处理
    let errorMessage = "Failed to delete exam";
    if (error.message.includes("ER_ROW_IS_REFERENCED")) {
      errorMessage = "无法删除试卷 - 请先删除相关题目";
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }

}