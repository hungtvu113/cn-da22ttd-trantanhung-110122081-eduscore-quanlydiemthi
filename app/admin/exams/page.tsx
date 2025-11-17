"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Calendar, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - Danh sách môn thi
const mockSubjects = [
  { id: "1", code: "ENG101", name: "Tiếng Anh Cơ bản" },
  { id: "2", code: "ENG201", name: "Tiếng Anh Giao tiếp" },
  { id: "3", code: "IT101", name: "Tin học Văn phòng" },
  { id: "4", code: "IT201", name: "Lập trình Web" },
]

// Mock data - Dữ liệu kỳ thi giả để test
const initialExams = [
  {
    id: "1",
    code: "EX2024001",
    name: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    subjectId: "1",
    subjectName: "Tiếng Anh Cơ bản",
    examDate: "2024-01-25",
    duration: 90,
    description: "Kỳ thi cuối khóa Tiếng Anh cơ bản",
    status: "upcoming",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    code: "EX2024002",
    name: "Kỳ thi Tin học Văn phòng - Tháng 1/2024",
    subjectId: "3",
    subjectName: "Tin học Văn phòng",
    examDate: "2024-01-28",
    duration: 120,
    description: "Kỳ thi thực hành Word, Excel, PowerPoint",
    status: "upcoming",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    code: "EX2024003",
    name: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    subjectId: "2",
    subjectName: "Tiếng Anh Giao tiếp",
    examDate: "2024-02-15",
    duration: 90,
    description: "Kỳ thi giao tiếp và nghe hiểu",
    status: "upcoming",
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    code: "EX2024004",
    name: "Kỳ thi Lập trình Web - Tháng 2/2024",
    subjectId: "4",
    subjectName: "Lập trình Web",
    examDate: "2024-02-20",
    duration: 180,
    description: "Kỳ thi thực hành HTML, CSS, JavaScript",
    status: "upcoming",
    createdAt: "2024-01-18",
  },
]

type Exam = {
  id: string
  code: string
  name: string
  subjectId: string
  subjectName: string
  examDate: string
  duration: number
  description: string
  status: string
  createdAt: string
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    subjectId: "",
    examDate: "",
    duration: "",
    description: "",
  })

  // Lọc kỳ thi theo tìm kiếm
  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mở dialog thêm kỳ thi
  const handleAdd = () => {
    setEditingExam(null)
    setFormData({
      code: "",
      name: "",
      subjectId: "",
      examDate: "",
      duration: "",
      description: "",
    })
    setIsDialogOpen(true)
  }

  // Mở dialog sửa kỳ thi
  const handleEdit = (exam: Exam) => {
    setEditingExam(exam)
    setFormData({
      code: exam.code,
      name: exam.name,
      subjectId: exam.subjectId,
      examDate: exam.examDate,
      duration: exam.duration.toString(),
      description: exam.description,
    })
    setIsDialogOpen(true)
  }

  // Mở dialog xác nhận xóa
  const handleDeleteClick = (exam: Exam) => {
    setDeletingExam(exam)
    setIsDeleteDialogOpen(true)
  }

  // Xóa kỳ thi
  const handleDelete = () => {
    if (deletingExam) {
      setExams(exams.filter((e) => e.id !== deletingExam.id))
      setIsDeleteDialogOpen(false)
      setDeletingExam(null)
    }
  }

  // Lưu kỳ thi (thêm hoặc sửa)
  const handleSave = () => {
    if (!formData.code || !formData.name || !formData.subjectId || !formData.examDate) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    const selectedSubject = mockSubjects.find((s) => s.id === formData.subjectId)

    if (editingExam) {
      // Sửa kỳ thi
      setExams(
        exams.map((exam) =>
          exam.id === editingExam.id
            ? {
                ...exam,
                code: formData.code,
                name: formData.name,
                subjectId: formData.subjectId,
                subjectName: selectedSubject?.name || "",
                examDate: formData.examDate,
                duration: parseInt(formData.duration) || 90,
                description: formData.description,
              }
            : exam
        )
      )
    } else {
      // Thêm kỳ thi mới
      const newExam: Exam = {
        id: Date.now().toString(),
        code: formData.code,
        name: formData.name,
        subjectId: formData.subjectId,
        subjectName: selectedSubject?.name || "",
        examDate: formData.examDate,
        duration: parseInt(formData.duration) || 90,
        description: formData.description,
        status: "upcoming",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setExams([...exams, newExam])
    }

    setIsDialogOpen(false)
    setFormData({
      code: "",
      name: "",
      subjectId: "",
      examDate: "",
      duration: "",
      description: "",
    })
  }

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Lấy badge status
  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: "bg-blue-100 text-blue-700",
      ongoing: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
    }
    const labels = {
      upcoming: "Sắp diễn ra",
      ongoing: "Đang diễn ra",
      completed: "Đã kết thúc",
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Quản lý Kỳ thi
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin các kỳ thi của trung tâm
            </p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Thêm kỳ thi
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, mã kỳ thi hoặc môn thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã kỳ thi</TableHead>
                <TableHead>Tên kỳ thi</TableHead>
                <TableHead>Môn thi</TableHead>
                <TableHead>Ngày thi</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "Không tìm thấy kỳ thi nào" : "Chưa có kỳ thi nào"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExams.map((exam, index) => (
                  <motion.tr
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{exam.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{exam.name}</div>
                      {exam.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {exam.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        {exam.subjectName}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(exam.examDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {exam.duration} phút
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(exam)}
                          className="gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(exam)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingExam ? "Chỉnh sửa kỳ thi" : "Thêm kỳ thi mới"}
            </DialogTitle>
            <DialogDescription>
              {editingExam
                ? "Cập nhật thông tin kỳ thi"
                : "Nhập thông tin kỳ thi mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã kỳ thi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: EX2024001"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Môn thi <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn thi" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Tên kỳ thi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">
                  Ngày thi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Thời gian thi (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="90"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về kỳ thi..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingExam ? "Cập nhật" : "Thêm kỳ thi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa kỳ thi{" "}
              <span className="font-semibold text-foreground">
                {deletingExam?.name}
              </span>
              ? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

