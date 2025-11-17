"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react"
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

// Mock data - Dữ liệu giả để test
const initialSubjects = [
  {
    id: "1",
    code: "ENG101",
    name: "Tiếng Anh Cơ bản",
    description: "Khóa học tiếng Anh cho người mới bắt đầu",
    credits: 3,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    code: "ENG201",
    name: "Tiếng Anh Giao tiếp",
    description: "Khóa học tiếng Anh giao tiếp nâng cao",
    credits: 4,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    code: "IT101",
    name: "Tin học Văn phòng",
    description: "Khóa học tin học cơ bản: Word, Excel, PowerPoint",
    credits: 3,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    code: "IT201",
    name: "Lập trình Web",
    description: "Khóa học lập trình web với HTML, CSS, JavaScript",
    credits: 5,
    createdAt: "2024-02-10",
  },
]

type Subject = {
  id: string
  code: string
  name: string
  description: string
  credits: number
  createdAt: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: 3,
  })

  // Lọc môn thi theo tìm kiếm
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mở dialog thêm mới
  const handleAdd = () => {
    setEditingSubject(null)
    setFormData({ code: "", name: "", description: "", credits: 3 })
    setIsDialogOpen(true)
  }

  // Mở dialog chỉnh sửa
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      code: subject.code,
      name: subject.name,
      description: subject.description,
      credits: subject.credits,
    })
    setIsDialogOpen(true)
  }

  // Mở dialog xóa
  const handleDelete = (subject: Subject) => {
    setDeletingSubject(subject)
    setIsDeleteDialogOpen(true)
  }

  // Xác nhận xóa
  const confirmDelete = () => {
    if (deletingSubject) {
      setSubjects(subjects.filter((s) => s.id !== deletingSubject.id))
      setIsDeleteDialogOpen(false)
      setDeletingSubject(null)
    }
  }

  // Lưu (thêm mới hoặc cập nhật)
  const handleSave = () => {
    if (editingSubject) {
      // Cập nhật
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id
            ? { ...s, ...formData }
            : s
        )
      )
    } else {
      // Thêm mới
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setSubjects([...subjects, newSubject])
    }
    setIsDialogOpen(false)
    setFormData({ code: "", name: "", description: "", credits: 3 })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Quản lý Môn thi</h1>
        </div>
        <p className="text-muted-foreground">
          Quản lý danh sách các môn thi trong hệ thống
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã môn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm môn thi
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border rounded-lg overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã môn</TableHead>
              <TableHead>Tên môn thi</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-center">Số tín chỉ</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "Không tìm thấy môn thi nào" : "Chưa có môn thi nào"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubjects.map((subject, index) => (
                <motion.tr
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell className="font-medium">{subject.code}</TableCell>
                  <TableCell className="font-semibold">{subject.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{subject.description}</TableCell>
                  <TableCell className="text-center">{subject.credits}</TableCell>
                  <TableCell>{subject.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(subject)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subject)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Chỉnh sửa môn thi" : "Thêm môn thi mới"}
            </DialogTitle>
            <DialogDescription>
              {editingSubject
                ? "Cập nhật thông tin môn thi"
                : "Nhập thông tin môn thi mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Mã môn *</Label>
              <Input
                id="code"
                placeholder="VD: ENG101"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Tên môn thi *</Label>
              <Input
                id="name"
                placeholder="VD: Tiếng Anh Cơ bản"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về môn thi..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="credits">Số tín chỉ</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!formData.code || !formData.name}>
              {editingSubject ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa môn thi{" "}
              <span className="font-semibold">{deletingSubject?.name}</span>?
              <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

