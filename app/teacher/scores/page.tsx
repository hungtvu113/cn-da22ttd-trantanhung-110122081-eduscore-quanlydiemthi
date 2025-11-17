"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileEdit,
  Search,
  Upload,
  Download,
  Save,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type StudentScore = {
  id: string
  studentCode: string
  studentName: string
  score: number | null
  notes: string
  status: string
}

// Mock data
const mockExams = [
  { id: "1", code: "EX2024001", name: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024" },
  { id: "3", code: "EX2024003", name: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024" },
  { id: "5", code: "EX2024005", name: "Kỳ thi Tiếng Anh Nâng cao - Tháng 3/2024" },
]

const initialStudents: StudentScore[] = [
  {
    id: "1",
    studentCode: "123456789",
    studentName: "Nguyễn Văn An",
    score: 8.5,
    notes: "Làm bài tốt",
    status: "Đã nhập",
  },
  {
    id: "2",
    studentCode: "987654321",
    studentName: "Trần Thị Bình",
    score: 9.0,
    notes: "Xuất sắc",
    status: "Đã nhập",
  },
  {
    id: "3",
    studentCode: "111222333",
    studentName: "Lê Hoàng Cường",
    score: null,
    notes: "",
    status: "Chưa nhập",
  },
  {
    id: "4",
    studentCode: "444555666",
    studentName: "Phạm Thị Dung",
    score: null,
    notes: "",
    status: "Chưa nhập",
  },
  {
    id: "5",
    studentCode: "777888999",
    studentName: "Võ Minh Đức",
    score: 7.5,
    notes: "",
    status: "Đã nhập",
  },
]

export default function TeacherScoresPage() {
  const [selectedExam, setSelectedExam] = useState("")
  const [students, setStudents] = useState<StudentScore[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentScore | null>(null)
  const [formData, setFormData] = useState({
    score: "",
    notes: "",
  })

  const filteredStudents = students.filter(
    (student) =>
      student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (student: StudentScore) => {
    setEditingStudent(student)
    setFormData({
      score: student.score?.toString() || "",
      notes: student.notes,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingStudent) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                score: formData.score ? parseFloat(formData.score) : null,
                notes: formData.notes,
                status: formData.score ? "Đã nhập" : "Chưa nhập",
              }
            : s
        )
      )
    }
    setIsDialogOpen(false)
  }

  const handleImportExcel = () => {
    // Tạo input file ẩn
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".xlsx,.xls"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Logic import Excel sẽ được implement sau
        alert(`Đã chọn file: ${file.name}\nChức năng import Excel sẽ được hoàn thiện sau!`)
      }
    }
    input.click()
  }

  const handleDownloadTemplate = () => {
    // Logic download template Excel
    alert("Đang tải template Excel...\nChức năng sẽ được hoàn thiện sau!")
  }

  const getGrade = (score: number | null) => {
    if (score === null) return { label: "-", color: "text-gray-500" }
    if (score >= 9.0) return { label: "Xuất sắc", color: "text-purple-500" }
    if (score >= 8.0) return { label: "Giỏi", color: "text-blue-500" }
    if (score >= 7.0) return { label: "Khá", color: "text-green-500" }
    if (score >= 5.5) return { label: "Trung bình", color: "text-yellow-500" }
    if (score >= 4.0) return { label: "Yếu", color: "text-orange-500" }
    return { label: "Kém", color: "text-red-500" }
  }

  const getStatusBadge = (status: string) => {
    return status === "Đã nhập"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  const enteredCount = students.filter((s) => s.score !== null).length
  const totalCount = students.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <FileEdit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Nhập điểm</h1>
            <p className="text-muted-foreground">
              Nhập điểm cho học viên hoặc import từ Excel
            </p>
          </div>
        </div>
      </motion.div>

      {/* Exam Selection & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card border rounded-lg p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="exam">Chọn kỳ thi</Label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn kỳ thi để nhập điểm" />
              </SelectTrigger>
              <SelectContent>
                {mockExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.code} - {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4" />
              Tải template
            </Button>
            <Button
              className="gap-2 bg-blue-500 hover:bg-blue-600"
              onClick={handleImportExcel}
            >
              <Upload className="w-4 h-4" />
              Import Excel
            </Button>
          </div>
        </div>

        {selectedExam && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tiến độ nhập điểm</p>
                <p className="text-2xl font-bold">
                  {enteredCount}/{totalCount}
                </p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold text-blue-500">
                  {totalCount > 0 ? Math.round((enteredCount / totalCount) * 100) : 0}%
                </p>
              </div>
            </div>
            <Button className="gap-2 bg-green-500 hover:bg-green-600">
              <Save className="w-4 h-4" />
              Lưu tất cả
            </Button>
          </div>
        )}
      </motion.div>

      {/* Search */}
      {selectedExam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-md"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã SV, tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </motion.div>
      )}

      {/* Students Table */}
      {selectedExam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border rounded-lg bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã SV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Xếp loại</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => {
                const grade = getGrade(student.score)
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="group"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {student.studentCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.studentName}
                    </TableCell>
                    <TableCell>
                      {student.score !== null ? (
                        <span className="text-lg font-bold text-blue-500">
                          {student.score.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${grade.color}`}>
                        {grade.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                      {student.notes || "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(student)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FileEdit className="w-4 h-4 mr-2" />
                        Nhập điểm
                      </Button>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Empty State */}
      {!selectedExam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <FileEdit className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chọn kỳ thi để bắt đầu</h3>
          <p className="text-muted-foreground max-w-md">
            Vui lòng chọn kỳ thi từ dropdown ở trên để bắt đầu nhập điểm cho học viên
          </p>
        </motion.div>
      )}

      {/* Edit Score Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập điểm</DialogTitle>
            <DialogDescription>
              Nhập điểm cho học viên {editingStudent?.studentName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Mã sinh viên</Label>
              <Input value={editingStudent?.studentCode} disabled />
            </div>

            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input value={editingStudent?.studentName} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">
                Điểm <span className="text-destructive">*</span>
              </Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="8.5"
                value={formData.score}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (value >= 0 && value <= 10) {
                    setFormData({ ...formData, score: e.target.value })
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">Thang điểm 0-10</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Nhận xét về bài thi..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!formData.score}>
              Lưu điểm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

