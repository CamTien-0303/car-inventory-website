// C# Backend có thể trả về PascalCase hoặc camelCase tùy config.
// Hàm helper này hỗ trợ bóc tách an toàn các key cơ bản.

export const normalizeProduct = (item) => ({
  id: item.ProductId ?? item.productId,
  brand: item.Brand ?? item.brand ?? "N/A",
  modelName: item.ModelName ?? item.modelName ?? "N/A",
  year: item.Year ?? item.year ?? 0,
  engineType: item.EngineType ?? item.engineType ?? "N/A",
  baseColor: item.BaseColor ?? item.baseColor ?? "N/A"
});

export const normalizeVehicle = (item) => ({
  vin: item.Vin ?? item.vin ?? "N/A",
  engineNumber: item.EngineNumber ?? item.engineNumber ?? "N/A",
  chassisNumber: item.ChassisNumber ?? item.chassisNumber ?? "N/A",
  productId: item.ProductId ?? item.productId,
  warehouseId: item.WarehouseId ?? item.warehouseId,
  status: item.Status ?? item.status ?? "N/A",
  currentLocationDetail: item.CurrentLocationDetail ?? item.currentLocationDetail ?? "N/A"
});

export const normalizeWarehouse = (item) => ({
  id: item.WarehouseId ?? item.warehouseId,
  name: item.Name ?? item.name ?? "N/A",
  address: item.Address ?? item.address ?? "N/A",
  capacity: item.Capacity ?? item.capacity ?? 0
});

export const normalizeSupplier = (item) => ({
  id: item.SupplierId ?? item.supplierId,
  supplierName: item.SupplierName ?? item.supplierName ?? "N/A",
  contactInfo: item.ContactInfo ?? item.contactInfo ?? "N/A"
});

export const normalizeTransaction = (item) => ({
  id: item.TransactionId ?? item.transactionId,
  vin: item.Vin ?? item.vin ?? "N/A",
  staffId: item.StaffId ?? item.staffId,
  type: item.Type ?? item.type ?? "N/A",
  price: item.Price ?? item.price ?? 0,
  transactionDate: item.TransactionDate ?? item.transactionDate ?? new Date().toISOString()
});

export const normalizeStaff = (item) => ({
  id: item.StaffId ?? item.staffId,
  fullName: item.FullName ?? item.fullName ?? "N/A",
  departmentRole: item.DepartmentRole ?? item.departmentRole ?? "N/A",
  phone: item.Phone ?? item.phone ?? "N/A",
  email: item.Email ?? item.email ?? "N/A",
  status: item.Status ?? item.status ?? false
});

export const normalizeVehicleDocument = (item) => ({
  id: item.DocumentId ?? item.documentId,
  vin: item.Vin ?? item.vin ?? "N/A",
  documentType: item.DocumentType ?? item.documentType ?? "N/A",
  status: item.Status ?? item.status ?? "N/A",
  issueDate: item.IssueDate ?? item.issueDate,
  fileUrl: item.FileUrl ?? item.fileUrl ?? ""
});

export const normalizeReport = (item) => ({
  vin: item.vin ?? item.Vin ?? "N/A",
  brand: item.brand ?? item.Brand ?? "N/A",
  modelName: item.model_name ?? item.modelName ?? item.ModelName ?? "N/A",
  warehouseName: item.warehouse_name ?? item.warehouseName ?? item.WarehouseName ?? "N/A",
  status: item.status ?? item.Status ?? "N/A",
  currentLocationDetail: item.current_location_detail ?? item.currentLocationDetail ?? item.CurrentLocationDetail ?? "N/A",
  daysInInventory: item.days_in_inventory ?? item.daysInInventory ?? 0
});
