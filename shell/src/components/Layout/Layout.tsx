import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Home,
  PanelLeft,
  LayoutGrid,
  FileEdit,
  ShieldCheck,
  Search,
  Mail,
  Award,
  Building,
  FileCheck2,
  FileText,
  Sliders,
  UserCheck,
  ClipboardCheck,
  FolderOpen,
  Sparkles,
  Upload,
  Send,
  FileSpreadsheet,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { storage } from "../../utils/sastStorage";
import { eventBus } from "@template/shared";

interface LayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProcessingMenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  submenus?: { id: string; name: string }[];
}

const processingMenuItems: ProcessingMenuItem[] = [
  {
    id: "initial-de",
    name: "Initial Data Entry (IDE)",
    icon: FileEdit,
    submenus: [
      { id: "ide-form", name: "Input Aplikasi Baru" },
      { id: "ide-list", name: "Daftar Draf Prospek" },
      { id: "ide-skdr", name: "Perubahan SKDR" },
      { id: "ide-eform", name: "Inbox Griya Eform" },
    ],
  },
  {
    id: "dtbo",
    name: "Document To Be Obtained (DTBO)",
    icon: FileText,
    submenus: [
      { id: "dtbo-incoming", name: "Incoming Application & Checking" },
      { id: "dtbo-monitoring", name: "DTBO Monitoring" },
      { id: "dtbo-update", name: "DTBO Update" },
    ],
  },
  { id: "duplicate-check", name: "Duplicate & Blacklist Checking", icon: ShieldCheck },
  {
    id: "detail-de",
    name: "Detail Data Entry (DDE)",
    icon: FileCheck2,
    badge: "1 Baru",
    submenus: [
      { id: "detail-de-list", name: "Antrean Data Entry" },
      { id: "detail-de-mitrakarya", name: "Mitrakarya Data Entry" },
    ],
  },
  {
    id: "verification",
    name: "Verification & Appraisal",
    icon: UserCheck,
    submenus: [
      { id: "verif-assign", name: "Verification Assignment" },
      { id: "verif-appraisal", name: "Appraisal (Taksasi Agunan)" },
      { id: "verif-investigation", name: "Investigation" },
      { id: "verif-checklist", name: "Verification Checklist" },
    ],
  },
  {
    id: "bi-checking",
    name: "BI Checking / SLIK",
    icon: Search,
    submenus: [
      { id: "bi-check-req", name: "Permintaan BI Checking" },
      { id: "bi-check-res", name: "Hasil BI Checking (SLIK)" },
    ],
  },
  { id: "scoring", name: "Scoring & Limit Setting", icon: Sliders },
  { id: "credit-proposal", name: "Credit Proposal (NAK)", icon: FileSpreadsheet },
  {
    id: "skk",
    name: "SKK / SPPK",
    icon: Award,
    submenus: [
      { id: "skk-create", name: "Create Surat Keputusan Kredit" },
      { id: "skk-monitoring", name: "SKK Monitoring" },
    ],
  },
  {
    id: "disbursement",
    name: "Loan Disbursement (Pencairan)",
    icon: Building,
    submenus: [
      { id: "disb-confirm", name: "SKK Confirmation Letter" },
      { id: "disb-signing", name: "Perjanjian Kredit & Pengikatan" },
      { id: "disb-notary", name: "Compliance Review Notaris" },
      { id: "disb-booking", name: "Booking Kredit (SIBS)" },
    ],
  },
  {
    id: "inquiry",
    name: "Inquiry & Facilities",
    icon: Layers,
    submenus: [
      { id: "inq-status", name: "Inquiry by Status" },
      { id: "inq-stage", name: "Inquiry by Stage" },
      { id: "inq-pameran", name: "Inquiry Pameran & Event" },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isDataEntry = location.pathname.startsWith("/data-entry");

  // Filter menu strictly by user role (default view)
  const getNavItems = (): NavigationItem[] => {
    const roles = user?.roles || ["sales"];
    const items: NavigationItem[] = [];

    if (roles.includes("sales")) {
      items.push({
        id: "ide-mfe",
        name: "Initial Data Entry (IDE)",
        href: "/initial-data-entry",
        icon: FileEdit,
      });
    }

    if (roles.includes("de") || roles.includes("spv_ca") || roles.includes("mailingroom")) {
      items.push({
        id: "data-entry",
        name: "Data Entry (DE)",
        href: "/data-entry",
        icon: FileCheck2,
      });
    }

    

    if (roles.includes("ca")) {
      items.push({
        id: "ca",
        name: "Credit Analysis (CA)",
        href: "/credit-analyst",
        icon: Search,
      });
    }

    if (roles.includes("mailingroom")) {
      items.push({
        id: "mailingroom",
        name: "Mailing Room",
        href: "/mailing-room",
        icon: Mail,
      });
    }

    if (roles.includes("pemimpin")) {
      items.push({
        id: "pemimpin",
        name: "Approval Pemimpin",
        href: "/pemimpin",
        icon: Award,
      });
    }

    if (roles.includes("adc")) {
      items.push({
        id: "adc",
        name: "Appraisal & DC",
        href: "/adc",
        icon: Building,
      });
    }

    return items;
  };

  const navigation = getNavItems();

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = storage.retrieve("sidebarExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const [activeProcessingMenu, setActiveProcessingMenu] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get("menu") || "detail-de";
  });

  useEffect(() => {
    storage.store("sidebarExpanded", JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get("menu") || "detail-de";
    setActiveProcessingMenu(m);
  }, [location.search]);

  useEffect(() => {
    const unsub = eventBus.subscribe("DATA_ENTRY_MENU_SELECT", (m: string) => {
      if (m) setActiveProcessingMenu(m);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleSelectProcessingMenu = (menuId: string) => {
    setActiveProcessingMenu(menuId);
    if (menuId === "ide-form") {
      navigate("/initial-data-entry/form");
    } else if (menuId === "ide-list") {
      navigate("/initial-data-entry/list");
    } else if (menuId.startsWith("ide") || menuId === "initial-de") {
      navigate("/initial-data-entry");
    } else {
      navigate(`/data-entry?menu=${menuId}`);
    }
    eventBus.publish("DATA_ENTRY_MENU_SELECT", menuId);
  };

  const toggleSubmenu = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubmenu(expandedSubmenu === menuId ? null : menuId);
  };

  const handleLogout = () => {
    logout();
  };

  // Data Entry (Processing) menggunakan sidebar dan header otentik sendiri (Sesuai Gambar 1)
  if (isDataEntry) {
    return <main className="w-full min-h-screen bg-white">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full border-r transition-all duration-300 z-40 flex flex-col justify-between ${
          isDataEntry
            ? "bg-[#004d40] text-white border-teal-900"
            : "bg-white text-gray-800 border-gray-200"
        } ${sidebarExpanded ? "w-64" : "w-20"}`}
      >
        <div>
          {/* Logo / Header Atas Sidebar */}
          <div
            className={`h-16 flex items-center justify-between px-4 border-b ${
              isDataEntry ? "border-teal-800/80 bg-[#003d33]" : "border-gray-200"
            }`}
          >
            {sidebarExpanded ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#e65100] flex items-center justify-center shadow-xs">
                  <span className="text-white font-black text-sm">BNI</span>
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={`font-black text-xs tracking-wider uppercase ${
                      isDataEntry ? "text-white" : "text-gray-900"
                    }`}
                  >
                    e-Origination
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      isDataEntry ? "text-teal-200" : "text-gray-500"
                    }`}
                  >
                    {isDataEntry ? "Loan Processing" : "Consumer Loan"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <div className="h-8 w-8 rounded-lg bg-[#e65100] flex items-center justify-center">
                  <span className="text-white font-black text-sm">B</span>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              KONDISI 1: MENU KHUSUS SAAT MASUK KE PROCESSING / DATA ENTRY
              (12 Modul Loan Processing masuk ke sidebar kiri)
          ======================================================== */}
          {isDataEntry ? (
            <div className="py-3 px-2 space-y-2">
              {/* Tombol Kembali ke Marketing (IDE) */}
              {sidebarExpanded ? (
                <div className="px-1 mb-2">
                  <Link
                    to="/initial-data-entry"
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-teal-900/60 hover:bg-teal-900 text-teal-100 hover:text-white border border-teal-700/60 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowLeft className="h-3.5 w-3.5 text-teal-300" />
                      <span>Kembali ke Marketing</span>
                    </span>
                    <span className="text-[10px] bg-teal-800 px-1 rounded text-teal-200">IDE</span>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center mb-2">
                  <Link
                    to="/initial-data-entry"
                    title="Kembali ke Marketing (IDE)"
                    className="p-2 rounded-lg bg-teal-900/60 hover:bg-teal-900 text-teal-100 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 text-teal-300" />
                  </Link>
                </div>
              )}

              {/* Header Judul Modul Processing */}
              {sidebarExpanded && (
                <div className="px-2 pb-1.5 border-b border-teal-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-amber-300" />
                    Loan Processing
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-900/80 text-teal-200">
                    12 Modul
                  </span>
                </div>
              )}

              {/* List 12 Modul Processing */}
              <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1 text-xs">
                {processingMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeProcessingMenu === item.id;
                  const hasSubmenu = item.submenus && item.submenus.length > 0;
                  const isExpanded = expandedSubmenu === item.id;

                  return (
                    <div key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectProcessingMenu(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                          isActive
                            ? "bg-amber-400 text-slate-950 font-bold shadow-xs scale-[1.01]"
                            : "text-teal-50 hover:bg-teal-800/70 hover:text-white"
                        } ${!sidebarExpanded ? "justify-center px-2" : ""}`}
                        title={!sidebarExpanded ? item.name : ""}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-slate-950" : "text-teal-300"
                            }`}
                          />
                          {sidebarExpanded && <span className="truncate">{item.name}</span>}
                        </span>

                        {sidebarExpanded && (
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                                  isActive
                                    ? "bg-slate-900 text-amber-300"
                                    : "bg-amber-400 text-slate-900"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {hasSubmenu && (
                              <button
                                type="button"
                                onClick={(e) => toggleSubmenu(item.id, e)}
                                className="p-0.5 rounded hover:bg-black/10 cursor-pointer"
                              >
                                <ChevronRight
                                  className={`h-3 w-3 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        )}
                      </button>

                      {/* Submenu Dropdown */}
                      {sidebarExpanded && hasSubmenu && isExpanded && (
                        <div className="pl-6 pr-1 py-1 space-y-0.5 bg-teal-950/40 rounded-lg mt-0.5 animate-fade-in text-[11px]">
                          {item.submenus!.map((sub) => (
                            <button
                              key={sub.name}
                              type="button"
                              onClick={() => handleSelectProcessingMenu(sub.id)}
                              className="w-full text-left px-2 py-1 rounded text-teal-200 hover:text-white hover:bg-teal-800/50 cursor-pointer flex items-center gap-1.5"
                            >
                              <span className="h-1 w-1 rounded-full bg-teal-300" />
                              <span className="truncate">{sub.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ) : (
            /* ========================================================
               KONDISI 2: DEFAULT SIDEBAR (Bukan di Processing)
               Menu Loan Processing OTOMATIS HILANG
            ======================================================== */
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-6rem)]">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-50 text-orange-600 font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } ${!sidebarExpanded ? "justify-center" : ""}`}
                    title={!sidebarExpanded ? item.name : ""}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-orange-600" : "text-gray-500"
                      }`}
                    />
                    {sidebarExpanded && <span className="whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Footer Sisi Bawah Sidebar */}
        {sidebarExpanded && isDataEntry && (
          <div className="p-3 border-t border-teal-800/80 bg-[#003d33] text-[11px] text-teal-100">
            <div className="text-[10px] text-teal-300 uppercase font-semibold">Petugas Processing:</div>
            <div className="font-bold text-white truncate">
              {user?.name ? user.name.toUpperCase() : "SURYA HARJAYA (STAFF STA)"}
            </div>
            <div className="text-[10px] text-teal-200">046 - SERANG</div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ml-0 ${sidebarExpanded ? "md:ml-64" : "md:ml-20"} min-w-0 overflow-x-hidden`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <PanelLeft className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {user?.name || "Surya Harjaya (STAFF STA)"}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {user?.branch || "046 - SERANG"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Keluar / Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}

export { Layout };


