"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Student = {
  id: string
  studentCode: string
  email: string
  fullName: string
  dateOfBirth: string
  phone: string
  address: string
  enrollmentDate: string
  status: string
  createdAt: string
}

const initialStudents: Student[] = [
  {
    id: "1",
    studentCode: "123456789",
    email: "123456789@st.tvu.edu.vn",
    fullName: "Nguyễn Văn An",
    dateOfBirth: "2003-05-15",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Phường 1, TP. Trà Vinh",
    enrollmentDate: "2021-09-01",
    status: "Đang học",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    studentCode: "987654321",
    email: "987654321@st.tvu.edu.vn",
    fullName: "Trần Thị Bình",
    dateOfBirth: "2003-08-20",
    phone: "0912345678",
    address: "456 Lê Lợi, Phường 2, TP. Trà Vinh",
    enrollmentDate: "2021-09-01",
    status: "Đang học",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    studentCode: "111222333",
    email: "111222333@st.tvu.edu.vn",
    fullName: "Lê Hoàng Cường",
    dateOfBirth: "2002-12-10",
    phone: "0923456789",
    address: "789 Trần Phú, Phường 3, TP. Trà Vinh",
    enrollmentDate: "2020-09-01",
    status: "Đang học",
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    studentCode: "444555666",
    email: "444555666@st.tvu.edu.vn",
    fullName: "Phạm Thị Dung",
    dateOfBirth: "2003-03-25",
    phone: "0934567890",
    address: "321 Nguyễn Thị Minh Khai, Phường 4, TP. Trà Vinh",
    enrollmentDate: "2021-09-01",
    status: "Tạm nghỉ",
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    studentCode: "777888999",
    email: "777888999@st.tvu.edu.vn",
    fullName: "Võ Minh Đức",
    dateOfBirth: "2001-07-18",
    phone: "0945678901",
    address: "654 Điện Biên Phủ, Phường 5, TP. Trà Vinh",
    enrollmentDate: "2019-09-01",
    status: "Đã tốt nghiệp",
    createdAt: "2024-01-15",
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    studentCode: "",
    fullName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    enrollmentDate: "",
    status: "Đang học",
  })

  const filteredStudents = students.filter(
    (student) =>
      student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery)
  )

  const handleAdd = () => {
    setEditingStudent(null)
    setFormData({
      studentCode: "",
      fullName: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      enrollmentDate: "",
      status: "Đang học",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      studentCode: student.studentCode,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      phone: student.phone,
      address: student.address,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (student: Student) => {
    setDeletingStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (editingStudent) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                ...formData,
                email: `${formData.studentCode}@st.tvu.edu.vn`,
              }
            : s
        )
      )
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
        email: `${formData.studentCode}@st.tvu.edu.vn`,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setStudents([...students, newStudent])
    }
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (deletingStudent) {
      setStudents(students.filter((s) => s.id !== deletingStudent.id))
      setIsDeleteDialogOpen(false)
      setDeletingStudent(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      "Đang học": "bg-green-500/10 text-green-500 border-green-500/20",
      "Tạm nghỉ": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "Đã tốt nghiệp": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    }
    return styles[status as keyof typeof styles] || styles["Đang học"]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đang học":
        return <UserCheck className="w-3 h-3" />
      case "Tạm nghỉ":
        return <UserX className="w-3 h-3" />
      case "Đã tốt nghiệp":
        return <GraduationCap className="w-3 h-3" />
      default:
        return <UserCheck className="w-3 h-3" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quản lý Học viên</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin học viên và sinh viên
            </p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã SV, tên, email, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm học viên
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border rounded-lg bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã SV</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Ngày nhập học</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="w-12 h-12 opacity-20" />
                    <p>Không tìm thấy học viên nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell className="font-mono font-medium">
                    {student.studentCode}
                  </TableCell>
                  <TableCell className="font-medium">{student.fullName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.email}
                  </TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {new Date(student.enrollmentDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        student.status
                      )}`}
                    >
                      {getStatusIcon(student.status)}
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(student)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Chỉnh sửa học viên" : "Thêm học viên mới"}
            </DialogTitle>
            <DialogDescription>
              {editingStudent
                ? "Cập nhật thông tin học viên"
                : "Nhập thông tin học viên mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentCode">
                  Mã sinh viên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentCode"
                  placeholder="123456789"
                  value={formData.studentCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 9)
                    setFormData({ ...formData, studentCode: value })
                  }}
                  maxLength={9}
                />
                <p className="text-xs text-muted-foreground">9 chữ số</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Tự động)</Label>
                <Input
                  id="email"
                  value={
                    formData.studentCode
                      ? `${formData.studentCode}@st.tvu.edu.vn`
                      : ""
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                placeholder="123 Nguyễn Huệ, Phường 1, TP. Trà Vinh"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Ngày nhập học</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollmentDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Tạm nghỉ">Tạm nghỉ</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.studentCode || !formData.fullName}
            >
              {editingStudent ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa học viên{" "}
              <span className="font-semibold">{deletingStudent?.fullName}</span> (
              {deletingStudent?.studentCode})? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

