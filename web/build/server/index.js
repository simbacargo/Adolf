import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, useLoaderData, useNavigate, useLocation, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, NavLink, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useEffect, useState, useMemo } from "react";
import { UserPlus, UserCircle, Users, CheckCircle2, XCircle, Search, ChevronUp, ChevronDown, Edit3, Trash2, X, ShieldCheck, User, Lock, Loader2, ArrowRight, ArrowLeft, KeyRound, ShieldAlert, Save } from "lucide-react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  request
}) {
  const url = new URL(request.url);
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(url.pathname);
  return {
    isPublicPath
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const {
    isPublicPath
  } = useLoaderData();
  const navigate = useNavigate();
  useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isPublicPath) {
      navigate("/login", {
        replace: true
      });
    }
    if (token && isPublicPath) {
      navigate("/", {
        replace: true
      });
    }
  }, [isPublicPath, navigate]);
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const generateMembers = () => {
  const firstNames = ["Juma", "Asha", "Mwinyi", "Neema", "Baraka", "Zuwena", "Said", "Fatuma", "Elias", "Lulu"];
  const lastNames = ["Kassim", "Mbeki", "Nyerere", "Mlowo", "Makamba", "Mtungi", "Chale", "Sokoine", "Mwinyi", "Moyo"];
  const maritalOptions = ["Single", "Married", "Divorced", "Widowed"];
  return Array.from({
    length: 100
  }, (_, i) => {
    const regDate = new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28));
    const expDate = new Date(regDate);
    expDate.setFullYear(expDate.getFullYear() + (Math.random() > 0.4 ? 1 : 0));
    return {
      id: i + 1,
      fullName: `${firstNames[Math.floor(Math.random() * 10)]} ${lastNames[Math.floor(Math.random() * 10)]}`,
      age: Math.floor(Math.random() * 45) + 18,
      sex: Math.random() > 0.5 ? "Male" : "Female",
      maritalStatus: maritalOptions[Math.floor(Math.random() * 4)],
      children: Math.floor(Math.random() * 6),
      phone: `+255 ${700 + Math.floor(Math.random() * 99)} ${Math.floor(1e5 + Math.random() * 9e5)}`,
      regDate: regDate.toISOString().split("T")[0],
      expDate: expDate.toISOString().split("T")[0]
    };
  });
};
const INITIAL_MEMBERS = generateMembers();
const API_URL = "https://adolf.nsaro.com/api/members/";
const MemberList = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  console.log("====================================");
  console.log(members);
  console.log("====================================");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "fullName",
    direction: "asc"
  });
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    sex: "Male",
    maritalStatus: "Single",
    children: 0,
    phone: "+255 ",
    regDate: "",
    expDate: "",
    membershipPlan: "Basic 5,000 ($5)"
    // Default Plan
  });
  const today = /* @__PURE__ */ new Date();
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
          }
        });
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchMembers();
  }, []);
  const processedData = useMemo(() => {
    return members.map((m) => ({
      ...m,
      isActive: new Date(m.expDate) > today
    }));
  }, [members]);
  const filteredMembers = useMemo(() => {
    return processedData.filter((m) => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm));
  }, [processedData, searchTerm]);
  const sortedMembers = useMemo(() => {
    const sortableItems = [...filteredMembers];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredMembers, sortConfig]);
  const openCreateModal = () => {
    setEditingMemberId(null);
    setFormData({
      fullName: "",
      age: "",
      sex: "Male",
      maritalStatus: "Single",
      children: 0,
      phone: "+255 ",
      regDate: "",
      expDate: "",
      membershipPlan: "Basic ($5)"
    });
    setIsModalOpen(true);
  };
  const openEditModal = (member) => {
    setEditingMemberId(member.id);
    setFormData(member);
    setIsModalOpen(true);
  };
  const deleteMember = async (id) => {
    if (window.confirm("Permanent Action: Delete this member?")) {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        setMembers(members.filter((m) => m.id !== id));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingMemberId ? "PUT" : "POST";
    const url = editingMemberId ? `${API_URL}${editingMemberId}/` : API_URL;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      const savedMember = await response.json();
      if (editingMemberId) {
        setMembers(members.map((m) => m.id === editingMemberId ? savedMember : m));
      } else {
        setMembers([savedMember, ...members]);
      }
      setIsModalOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "max-w-7xl mx-auto",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-4xl font-black text-slate-900 tracking-tight",
            children: "Tanzania Registry"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-slate-500 font-medium",
            children: "Community Member Management System"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex gap-3",
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: openCreateModal,
            className: "flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95",
            children: [/* @__PURE__ */ jsx(UserPlus, {
              size: 22
            }), "Register Member"]
          }), /* @__PURE__ */ jsx(NavLink, {
            to: "/change-password",
            title: "Settings",
            className: "flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 transition-all active:scale-95",
            children: /* @__PURE__ */ jsx(UserCircle, {
              size: 24
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5",
          children: [/* @__PURE__ */ jsx("div", {
            className: "bg-blue-50 p-4 rounded-2xl text-blue-600",
            children: /* @__PURE__ */ jsx(Users, {
              size: 28
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm text-slate-400 font-bold uppercase tracking-wider",
              children: "Total Records"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-3xl font-black",
              children: members.length
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5",
          children: [/* @__PURE__ */ jsx("div", {
            className: "bg-emerald-50 p-4 rounded-2xl text-emerald-600",
            children: /* @__PURE__ */ jsx(CheckCircle2, {
              size: 28
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm text-slate-400 font-bold uppercase tracking-wider",
              children: "Active Members"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-3xl font-black text-emerald-600",
              children: processedData.filter((m) => m.isActive).length
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5",
          children: [/* @__PURE__ */ jsx("div", {
            className: "bg-rose-50 p-4 rounded-2xl text-rose-600",
            children: /* @__PURE__ */ jsx(XCircle, {
              size: 28
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm text-slate-400 font-bold uppercase tracking-wider",
              children: "Expired"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-3xl font-black text-rose-600",
              children: processedData.filter((m) => !m.isActive).length
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden",
        children: [/* @__PURE__ */ jsx("div", {
          className: "p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6",
          children: /* @__PURE__ */ jsxs("div", {
            className: "relative group w-full lg:w-[450px]",
            children: [/* @__PURE__ */ jsx(Search, {
              className: "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors",
              size: 22
            }), /* @__PURE__ */ jsx("input", {
              type: "text",
              placeholder: "Search by name, phone...",
              className: "w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-slate-700 font-medium",
              onChange: (e) => setSearchTerm(e.target.value)
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "overflow-x-auto max-h-[600px] custom-scrollbar",
          children: /* @__PURE__ */ jsxs("table", {
            className: "w-full text-left border-separate border-spacing-0",
            children: [/* @__PURE__ */ jsx("thead", {
              className: "sticky top-0 z-30 bg-white/95 backdrop-blur-md",
              children: /* @__PURE__ */ jsxs("tr", {
                className: "text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black",
                children: [["fullName", "membershipPlan", "phone", "expDate", "isActive"].map((key) => /* @__PURE__ */ jsx("th", {
                  className: "px-8 py-5 border-b border-slate-100 cursor-pointer hover:text-blue-600 transition-colors",
                  onClick: () => setSortConfig({
                    key,
                    direction: sortConfig.direction === "asc" ? "desc" : "asc"
                  }),
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [key === "membershipPlan" ? "Plan" : key.replace(/([A-Z])/g, " $1").trim(), sortConfig.key === key && (sortConfig.direction === "asc" ? /* @__PURE__ */ jsx(ChevronUp, {
                      size: 14
                    }) : /* @__PURE__ */ jsx(ChevronDown, {
                      size: 14
                    }))]
                  })
                }, key)), /* @__PURE__ */ jsx("th", {
                  className: "px-8 py-5 border-b border-slate-100 text-right",
                  children: "Actions"
                })]
              })
            }), /* @__PURE__ */ jsx("tbody", {
              className: "divide-y divide-slate-50",
              children: sortedMembers.map((m) => /* @__PURE__ */ jsxs("tr", {
                className: "group hover:bg-blue-50/40 transition-all",
                children: [/* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 font-bold text-slate-800 whitespace-nowrap",
                  children: m.fullName
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5",
                  children: /* @__PURE__ */ jsx("span", {
                    className: "px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200",
                    children: m.membershipPlan || "Basic 5,000 ($3)"
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 font-mono text-sm text-slate-500",
                  children: m.phone
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 text-slate-500 text-sm whitespace-nowrap",
                  children: m.expDate
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5",
                  children: /* @__PURE__ */ jsx("span", {
                    className: `flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${m.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`,
                    children: m.isActive ? /* @__PURE__ */ jsxs(Fragment, {
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                      }), " Active"]
                    }) : /* @__PURE__ */ jsxs(Fragment, {
                      children: [/* @__PURE__ */ jsx(XCircle, {
                        size: 10
                      }), " Expired"]
                    })
                  })
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 text-right",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all",
                    children: [/* @__PURE__ */ jsx("button", {
                      onClick: () => openEditModal(m),
                      className: "p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all",
                      children: /* @__PURE__ */ jsx(Edit3, {
                        size: 18
                      })
                    }), /* @__PURE__ */ jsx("button", {
                      onClick: () => deleteMember(m.id),
                      className: "p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all",
                      children: /* @__PURE__ */ jsx(Trash2, {
                        size: 18
                      })
                    })]
                  })
                })]
              }, m.id))
            })]
          })
        })]
      })]
    }), isModalOpen && /* @__PURE__ */ jsx("div", {
      className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md",
      children: /* @__PURE__ */ jsxs("div", {
        className: "bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "p-8 border-b flex justify-between items-center bg-slate-50/50",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-black text-slate-900 tracking-tight",
              children: editingMemberId ? "Update Record" : "New Registration"
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-slate-500 font-medium",
              children: ["Registry ID: ", editingMemberId || "Auto-generated"]
            })]
          }), /* @__PURE__ */ jsx("button", {
            onClick: () => setIsModalOpen(false),
            className: "p-3 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all",
            children: /* @__PURE__ */ jsx(X, {
              size: 24
            })
          })]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          className: "p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2 col-span-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Full Name"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "text",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              value: formData.fullName,
              onChange: (e) => setFormData({
                ...formData,
                fullName: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 col-span-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-blue-600 tracking-widest ml-1",
              children: "Membership Plan"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsxs("select", {
                required: true,
                className: "w-full px-5 py-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-bold text-blue-900 transition-all appearance-none",
                value: formData.membershipPlan,
                onChange: (e) => setFormData({
                  ...formData,
                  membershipPlan: e.target.value
                }),
                children: [/* @__PURE__ */ jsx("option", {
                  value: "Basic 5,000 ($3)",
                  children: "Basic Tier — 5,000 ( $5.00)"
                }), /* @__PURE__ */ jsx("option", {
                  value: "Standard 7,000 ($5)",
                  children: "Standard Tier — 7,000 ( $7.00)"
                }), /* @__PURE__ */ jsx("option", {
                  value: "Premium 10,000 ($10)",
                  children: "Premium Tier —  10,000 ($10.00)"
                })]
              }), /* @__PURE__ */ jsx(ChevronDown, {
                className: "absolute right-5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none",
                size: 20
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Age"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "number",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              value: formData.age,
              onChange: (e) => setFormData({
                ...formData,
                age: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Sex"
            }), /* @__PURE__ */ jsxs("select", {
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all appearance-none",
              value: formData.sex,
              onChange: (e) => setFormData({
                ...formData,
                sex: e.target.value
              }),
              children: [/* @__PURE__ */ jsx("option", {
                children: "Male"
              }), /* @__PURE__ */ jsx("option", {
                children: "Female"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Phone (+255)"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "text",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all font-mono",
              value: formData.phone,
              onChange: (e) => setFormData({
                ...formData,
                phone: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-1",
              children: "Reg. Date"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "date",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              value: formData.regDate,
              onChange: (e) => setFormData({
                ...formData,
                regDate: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 col-span-2 md:col-span-1",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-rose-600 tracking-widest ml-1",
              children: "Exp. Date"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "date",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              value: formData.expDate,
              onChange: (e) => setFormData({
                ...formData,
                expDate: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "col-span-2 pt-6 flex flex-col md:flex-row gap-4",
            children: [/* @__PURE__ */ jsx("button", {
              type: "submit",
              className: "flex-1 bg-blue-600 text-white py-5 rounded-[20px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]",
              children: editingMemberId ? "Update Member Info" : "Confirm Registration"
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setIsModalOpen(false),
              className: "px-10 bg-slate-100 text-slate-500 py-5 rounded-[20px] font-black hover:bg-slate-200 transition-all",
              children: "Cancel"
            })]
          })]
        })]
      })
    })]
  });
};
const home = UNSAFE_withComponentProps(MemberList);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("https://adolf.nsaro.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("Connection failed. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "fixed top-0 left-0 w-full h-full overflow-hidden -z-10",
      children: [/* @__PURE__ */ jsx("div", {
        className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]"
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px]"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "w-full max-w-[480px] animate-in fade-in zoom-in duration-500",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center mb-10",
        children: [/* @__PURE__ */ jsx("div", {
          className: "inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[28px] shadow-2xl shadow-blue-200 mb-6 text-white",
          children: /* @__PURE__ */ jsx(ShieldCheck, {
            size: 40
          })
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-4xl font-black text-slate-900 tracking-tight",
          children: "HGI Foundation Tanzania"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-slate-500 font-medium mt-2",
          children: "Membership Registry "
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-10",
        children: [/* @__PURE__ */ jsxs("form", {
          onSubmit: handleLogin,
          className: "space-y-6",
          children: [error && /* @__PURE__ */ jsx("div", {
            className: "bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 animate-shake",
            children: error
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1",
              children: "Username"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative group",
              children: [/* @__PURE__ */ jsx(User, {
                className: "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors",
                size: 20
              }), /* @__PURE__ */ jsx("input", {
                required: true,
                type: "text",
                placeholder: "Enter username",
                className: "w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all text-slate-700",
                onChange: (e) => setCredentials({
                  ...credentials,
                  username: e.target.value
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1",
              children: "Password"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative group",
              children: [/* @__PURE__ */ jsx(Lock, {
                className: "absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors",
                size: 20
              }), /* @__PURE__ */ jsx("input", {
                required: true,
                type: "password",
                placeholder: "••••••••",
                className: "w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all text-slate-700",
                onChange: (e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })
              })]
            })]
          }), /* @__PURE__ */ jsx("button", {
            disabled: isLoading,
            type: "submit",
            className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[22px] font-black shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70",
            children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
              className: "animate-spin",
              size: 24
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: ["Authenticate", /* @__PURE__ */ jsx(ArrowRight, {
                size: 20
              })]
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10 pt-8 border-t border-slate-50 text-center",
          children: /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-slate-400 font-medium",
            children: ["Authorized Personnel Only.", /* @__PURE__ */ jsx("br", {}), "All access attempts are logged."]
          })
        })]
      }), /* @__PURE__ */ jsx("p", {
        className: "text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest",
        children: "© 2026 HGI Foundation Tanzania"
      })]
    })]
  });
};
const login = UNSAFE_withComponentProps(LoginPage);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login
}, Symbol.toStringTag, { value: "Module" }));
const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [status, setStatus] = useState({
    type: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setStatus({
        type: "error",
        message: "New passwords do not match."
      });
      return;
    }
    setIsLoading(true);
    setStatus({
      type: "",
      message: ""
    });
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://adolf.nsaro.com/api/change-password/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: "success",
          message: "Password updated successfully! Redirecting..."
        });
        setTimeout(() => navigate("/"), 2e3);
      } else {
        setStatus({
          type: "error",
          message: data.old_password || data.new_password || "Failed to update password."
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "Server connection error."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans",
    children: /* @__PURE__ */ jsxs("div", {
      className: "w-full max-w-[500px]",
      children: [/* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm mb-8 transition-colors group",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 18,
          className: "group-hover:-translate-x-1 transition-transform"
        }), "Back to Dashboard"]
      }), /* @__PURE__ */ jsxs("div", {
        className: "bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "p-10 bg-slate-50/50 border-b border-slate-100 text-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 text-blue-600",
            children: /* @__PURE__ */ jsx(KeyRound, {
              size: 32
            })
          }), /* @__PURE__ */ jsx("h1", {
            className: "text-2xl font-black text-slate-900 tracking-tight",
            children: "Security Settings"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-slate-500 font-medium",
            children: "Update your account password"
          })]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleChange,
          className: "p-10 space-y-6",
          children: [status.message && /* @__PURE__ */ jsxs("div", {
            className: `p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`,
            children: [status.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, {
              size: 20
            }) : /* @__PURE__ */ jsx(ShieldAlert, {
              size: 20
            }), status.message]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Current Password"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "password",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              onChange: (e) => setFormData({
                ...formData,
                old_password: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsx("hr", {
            className: "border-slate-50"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "New Password"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "password",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              onChange: (e) => setFormData({
                ...formData,
                new_password: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Confirm New Password"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              type: "password",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              onChange: (e) => setFormData({
                ...formData,
                confirm_password: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsx("button", {
            disabled: isLoading,
            type: "submit",
            className: "w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[22px] font-black shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 mt-4",
            children: isLoading ? /* @__PURE__ */ jsx(Loader2, {
              className: "animate-spin",
              size: 24
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Save, {
                size: 20
              }), " Update Password"]
            })
          })]
        })]
      })]
    })
  });
};
const ChangePasswordPage_default = UNSAFE_withComponentProps(ChangePasswordPage);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ChangePasswordPage_default
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DA4iXG-e.js", "imports": ["/assets/chunk-EPOLDU6W-COH--sv6.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Yf5coCpF.js", "imports": ["/assets/chunk-EPOLDU6W-COH--sv6.js"], "css": ["/assets/root-DLT1zAvI.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DE79xp8p.js", "imports": ["/assets/chunk-EPOLDU6W-COH--sv6.js", "/assets/createLucideIcon-zG5NMKvf.js", "/assets/circle-check-CEpkT5PV.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "login/login": { "id": "login/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-DWghYf4k.js", "imports": ["/assets/chunk-EPOLDU6W-COH--sv6.js", "/assets/createLucideIcon-zG5NMKvf.js", "/assets/loader-circle-C7Zx01Z4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "login/ChangePasswordPage": { "id": "login/ChangePasswordPage", "parentId": "root", "path": "change-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/ChangePasswordPage-BZnZKzlA.js", "imports": ["/assets/chunk-EPOLDU6W-COH--sv6.js", "/assets/createLucideIcon-zG5NMKvf.js", "/assets/circle-check-CEpkT5PV.js", "/assets/loader-circle-C7Zx01Z4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-102b892c.js", "version": "102b892c", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "login/login": {
    id: "login/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "login/ChangePasswordPage": {
    id: "login/ChangePasswordPage",
    parentId: "root",
    path: "change-password",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
