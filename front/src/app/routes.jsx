// import GroupsIcon from "@mui/icons-material/Groups";
// import HomeIcon from "@mui/icons-material/Home";
// import EuroIcon from "@mui/icons-material/Euro";
// import LooksOneIcon from "@mui/icons-material/LooksOne";
// import LooksTwoIcon from "@mui/icons-material/LooksTwo";
// import Looks3Icon from "@mui/icons-material/Looks3";
// import PersonIcon from "@mui/icons-material/Person";
// import BadgeIcon from "@mui/icons-material/Badge";
import { Login } from "../main/pages/login/Login";
import { Home } from "../main/pages/login/home/Home";
// import { TablePage } from "../main/pages/tablePage/TablePage";
// import { CustomerDetails } from "../main/pages/customerDetails/CustomerDetails";
// import { Bulletin } from "../main/pages/bulletin/Bulletin";
// import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
// import { InvestmentHeaders } from "../commons/components/investmentHeaders/InvestmentHeaders";
// import { Page } from "../commons/components/page/Page";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
// import Accordion from "@mui/material/Accordion";

export const routesDict = {
  "": [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/home",
      element: (
        // <Page>
        <Home />
        // </Page>
      ),
    },
    // {
    //   path: "/customer/:id",
    //   element: <CustomerDetails />,
    // },
  ],
  // ADMINISTRATION: [
  //   {
  //     path: "/kycPending",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getPendingKYC" />
  //       </Page>
  //     ),
  //     icon: <PersonIcon />,
  //   },
  //   {
  //     path: "/idDocPending",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getInReviewDoc" />
  //       </Page>
  //     ),
  //     icon: <BadgeIcon />,
  //   },
  //   {
  //     path: "/poaPending",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getInReviewAddress" />
  //       </Page>
  //     ),
  //     icon: <HomeIcon />,
  //   },
  //   {
  //     path: "/paymentPending",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getPendingProofPay" />
  //       </Page>
  //     ),
  //     icon: <EuroIcon />,
  //   },
  //   {
  //     path: "/firstSecondPaymentProofs",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getInvestAcceptedWithoutDocuments" />
  //       </Page>
  //     ),
  //     icon: <ReceiptLongIcon />,
  //   },
  //   {
  //     path: "/thirdPaymentProofs",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getInvestAcceptedWithoutDocumentsNew" />
  //       </Page>
  //     ),
  //     icon: <ReceiptLongTwoToneIcon />,
  //   },
  //   {
  //     path: "/allCustomers",
  //     element: (
  //       <Page>
  //         <TablePage url="adm/getAll" />
  //       </Page>
  //     ),
  //     icon: <GroupsIcon />,
  //   },
  // ],
  // SAURUS: [
  //   {
  //     path: "/bulletin",
  //     element: <Bulletin />,
  //     icon: <GradeRoundedIcon />,
  //   },
  //   {
  //     path: "/firstInvestmentRound",
  //     element: (
  //       <Page>
  //         <TablePage
  //           headers={[
  //             {
  //               title: "TOTAL_INVESTMENT",
  //               params: { programCode: "saurus", roundCode: "01" },
  //             },
  //           ]}
  //           url="adm/getInvestAccepted"
  //           params={{ programCode: "saurus", roundCode: "01" }}
  //         />
  //       </Page>
  //     ),
  //     icon: <LooksOneIcon />,
  //   },
  //   {
  //     path: "/secondInvestmentRound",
  //     element: (
  //       <Page>
  //         <TablePage
  //           headers={[
  //             {
  //               title: "TOTAL_INVESTMENT",
  //               params: { programCode: "saurus", roundCode: "02" },
  //             },
  //           ]}
  //           url="adm/getInvestAccepted"
  //           params={{ programCode: "saurus", roundCode: "02" }}
  //         />
  //       </Page>
  //     ),
  //     icon: <LooksTwoIcon />,
  //   },
  //   {
  //     path: "/thirdInvestmentRound",
  //     element: (
  //       <Page>
  //         <TablePage
  //           headers={[
  //             {
  //               title: "TOTAL_INVESTMENT",
  //               params: { programCode: "saurus", roundCode: "00" },
  //             },
  //             {
  //               title: "REWIRE_INVESTMENT",
  //               params: { programCode: "saurus", roundCode: "03" },
  //             },
  //             {
  //               title: "MEXICO_INVESTMENT",
  //               params: { programCode: "saurusMexico", roundCode: "01" },
  //             },
  //           ]}
  //           url="adm/getInvestAccepted2"
  //           params={{ programCode: "saurus", roundCode: "03" }}
  //         />
  //       </Page>
  //     ),
  //     icon: <Looks3Icon />,
  //   },
  // ],
};
