import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useMemo } from "react";
import { UserPlus, Users, CheckCircle2, XCircle, Search, ChevronUp, ChevronDown, Edit3, Trash2, X } from "lucide-react";
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
  links
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
const MemberList = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
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
    expDate: ""
  });
  const today = /* @__PURE__ */ new Date();
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
      expDate: ""
    });
    setIsModalOpen(true);
  };
  const openEditModal = (member) => {
    setEditingMemberId(member.id);
    setFormData(member);
    setIsModalOpen(true);
  };
  const deleteMember = (id) => {
    if (window.confirm("Permanent Action: Delete this member from the registry?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMemberId) {
      setMembers(members.map((m) => m.id === editingMemberId ? {
        ...formData,
        id: editingMemberId
      } : m));
    } else {
      setMembers([{
        ...formData,
        id: Date.now()
      }, ...members]);
    }
    setIsModalOpen(false);
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
        }), /* @__PURE__ */ jsxs("button", {
          onClick: openCreateModal,
          className: "flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95",
          children: [/* @__PURE__ */ jsx(UserPlus, {
            size: 22
          }), "Register Member"]
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
                children: [["fullName", "age", "sex", "maritalStatus", "children", "phone", "regDate", "expDate", "isActive"].map((key) => /* @__PURE__ */ jsx("th", {
                  className: "px-8 py-5 border-b border-slate-100 cursor-pointer hover:text-blue-600 transition-colors",
                  onClick: () => setSortConfig({
                    key,
                    direction: sortConfig.direction === "asc" ? "desc" : "asc"
                  }),
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [key.replace(/([A-Z])/g, " $1").trim(), sortConfig.key === key && (sortConfig.direction === "asc" ? /* @__PURE__ */ jsx(ChevronUp, {
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
                  className: "px-8 py-5 text-slate-600 font-medium",
                  children: m.age
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 text-slate-600 font-medium",
                  children: m.sex
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 text-slate-500",
                  children: m.maritalStatus
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 text-center text-slate-600 font-bold",
                  children: m.children
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 font-mono text-sm text-slate-500",
                  children: m.phone
                }), /* @__PURE__ */ jsx("td", {
                  className: "px-8 py-5 text-slate-500 text-sm whitespace-nowrap",
                  children: m.regDate
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
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-blue-600",
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
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1",
              children: "Children"
            }), /* @__PURE__ */ jsx("input", {
              type: "number",
              className: "w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all",
              value: formData.children,
              onChange: (e) => setFormData({
                ...formData,
                children: e.target.value
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-emerald-600",
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
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx("label", {
              className: "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-rose-600",
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
const serverManifest = { "entry": { "module": "/assets/entry.client-BmDBpHZU.js", "imports": ["/assets/chunk-EPOLDU6W-Wp3N_t67.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CD0VWafI.js", "imports": ["/assets/chunk-EPOLDU6W-Wp3N_t67.js"], "css": ["/assets/root-CQw99d1_.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-D2C6_HNa.js", "imports": ["/assets/chunk-EPOLDU6W-Wp3N_t67.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-9f0dea9a.js", "version": "9f0dea9a", "sri": void 0 };
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
