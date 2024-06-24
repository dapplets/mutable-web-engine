"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalWindows = void 0;
const react_1 = __importStar(require("react"));
const modal_context_1 = require("../contexts/modal-context");
const Toast_1 = __importDefault(require("react-bootstrap/Toast"));
const ToastContainer_1 = __importDefault(require("react-bootstrap/ToastContainer"));
const styled_components_1 = __importDefault(require("styled-components"));
const IconAlert = () => (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none" },
    react_1.default.createElement("path", { d: "M8.57502 3.21665L1.51668 15C1.37116 15.252 1.29416 15.5377 1.29334 15.8288C1.29253 16.1198 1.36793 16.4059 1.51204 16.6588C1.65615 16.9116 1.86396 17.1223 2.11477 17.2699C2.36559 17.4174 2.65068 17.4968 2.94168 17.5H17.0583C17.3494 17.4968 17.6344 17.4174 17.8853 17.2699C18.1361 17.1223 18.3439 16.9116 18.488 16.6588C18.6321 16.4059 18.7075 16.1198 18.7067 15.8288C18.7059 15.5377 18.6289 15.252 18.4834 15L11.425 3.21665C11.2765 2.97174 11.0673 2.76925 10.8177 2.62872C10.5681 2.48819 10.2865 2.41437 10 2.41437C9.71357 2.41437 9.43196 2.48819 9.18235 2.62872C8.93275 2.76925 8.72358 2.97174 8.57502 3.21665Z", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    react_1.default.createElement("path", { d: "M10 7.5V10.8333", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    react_1.default.createElement("path", { d: "M10 14.1667H10.0088", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })));
const IconInfo = () => (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none" },
    react_1.default.createElement("g", { clipPath: "url(#clip0_10_108)" },
        react_1.default.createElement("path", { d: "M9.99996 18.3334C14.6023 18.3334 18.3333 14.6024 18.3333 10C18.3333 5.39765 14.6023 1.66669 9.99996 1.66669C5.39759 1.66669 1.66663 5.39765 1.66663 10C1.66663 14.6024 5.39759 18.3334 9.99996 18.3334Z", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
        react_1.default.createElement("path", { d: "M10 5V10L13.3333 11.6667", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
    react_1.default.createElement("defs", null,
        react_1.default.createElement("clipPath", { id: "clip0_10_108" },
            react_1.default.createElement("rect", { width: "20", height: "20", fill: "white" })))));
const IconError = () => (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none" },
    react_1.default.createElement("g", { clipPath: "url(#clip0_10_182)" },
        react_1.default.createElement("path", { d: "M6.54996 1.66669H13.45L18.3333 6.55002V13.45L13.45 18.3334H6.54996L1.66663 13.45V6.55002L6.54996 1.66669Z", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
        react_1.default.createElement("path", { d: "M12.5 7.5L7.5 12.5", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
        react_1.default.createElement("path", { d: "M7.5 7.5L12.5 12.5", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
    react_1.default.createElement("defs", null,
        react_1.default.createElement("clipPath", { id: "clip0_10_182" },
            react_1.default.createElement("rect", { width: "20", height: "20", fill: "white" })))));
const ButtonAction = styled_components_1.default.button `
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #02193a;
  outline: none;
  width: 86px;
  height: 30px;
  border-radius: 90px;
  background: #fff;
  color: #02193a;
  &:hover {
    background: #02193a;
    color: #fff;
  }
`;
const IconWrapper = styled_components_1.default.div `
  border-bottom-right-radius: 10px;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$type === 'error' ? '#DB504A' : props.$type === 'warning' ? '#d0911a' : '#384BFF'};
`;
const ToastContainerStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 99999999,
    transition: 'all .2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};
const toastHeaderStyle = {
    paddingLeft: '3rem',
    borderBottom: 'none',
    paddingRight: '1rem',
    fontSize: '16px',
    fontWeight: '600',
};
const toastBodyStyle = {
    color: '#7A818B',
};
const buttonsBlockStyle = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    padding: '10px',
};
const ModalWindows = () => {
    const { modals, closeModal } = (0, modal_context_1.useModal)();
    const [isHovering, setIsHovering] = (0, react_1.useState)(false);
    const [closingModals, setClosingModals] = (0, react_1.useState)([]);
    const handleMouseEnter = () => {
        setIsHovering(!isHovering);
    };
    const handleClose = (id) => {
        setClosingModals((prev) => [...prev, id]);
        setTimeout(() => {
            closeModal(+id);
            setClosingModals((prev) => prev.filter((modalId) => modalId !== id));
        }, 200);
    };
    return (react_1.default.createElement(ToastContainer_1.default, { style: ToastContainerStyle, onDoubleClick: handleMouseEnter },
        !isHovering && modals.length > 3 ? (react_1.default.createElement("style", null, `
          .toast-container::before,
          .toast-container::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 10px;
            background: #02193A;
            left: 0;
          }

          .toast-container::before {
           bottom: 100%;
           border-radius: 10px 10px 0 0;
           box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
           width: 90%;
           height: 7px;
           opacity: 0.3;
           left: 10px;
          }

          .toast-container::after {
          bottom: 98%;
          border-radius: 10px 10px 0px 0px;
          box-shadow: 0 0px 5px rgba(0, 0, 0, 0.5);
          left: 5px;
          width: 95%;
          opacity: 0.5;
          height: 5px;

          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateY(100%);
              opacity: 0;
            }
          }
        `)) : null,
        modals.map(({ subject, body, type, actions, id }, index) => {
            const isVisible = isHovering || modals.length <= 3 || index === modals.length - 1;
            return (react_1.default.createElement(Toast_1.default, { key: id, show: isVisible, onClose: () => handleClose(id.toString()), style: {
                    borderRadius: '10px',
                    border: '1px solid #02193A',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    fontFamily: 'sans-serif',
                    marginBottom: '0px',
                    animation: closingModals.includes(id.toString())
                        ? 'slideOut 0.5s ease-in-out'
                        : 'slideIn 0.5s ease-in-out',
                } },
                react_1.default.createElement("style", null, `
              @keyframes slideIn {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              @keyframes slideOut {
                from {
                  transform: translateX(0);
                  opacity: 1;
                }
                to {
                  transform: translateY(100%);
                  opacity: 0;
                }
              }
            `),
                react_1.default.createElement("div", { style: { position: 'relative' } },
                    react_1.default.createElement(Toast_1.default.Header, { className: `alert-${type.toLowerCase()}`, style: toastHeaderStyle },
                        react_1.default.createElement(IconWrapper, { "$type": type.toLowerCase() }, type.toLowerCase() === 'error' ? (react_1.default.createElement(IconError, null)) : type.toLowerCase() === 'warning' ? (react_1.default.createElement(IconAlert, null)) : (react_1.default.createElement(IconInfo, null))),
                        react_1.default.createElement("strong", { className: "me-auto" }, subject))),
                react_1.default.createElement(Toast_1.default.Body, { style: toastBodyStyle }, body),
                react_1.default.createElement("div", { style: buttonsBlockStyle }, actions === null || actions === void 0 ? void 0 : actions.map(({ label, onClick }) => (react_1.default.createElement(ButtonAction, { key: label, onClick: () => {
                        onClick();
                        closeModal(id);
                    } }, label))))));
        })));
};
exports.ModalWindows = ModalWindows;
