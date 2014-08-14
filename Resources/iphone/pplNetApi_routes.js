module.exports = {
    base: "https://qa1-www.mypeoplenet.com/clockAPI",
    testTermId: "pn3tt3st",
    defaultMethod: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-encoding": "gzip"
    },
    endpoints: {
        checkin: {
            method: "GET",
            url: "/device/checkin"
        },
        checkinComplete: {
            method: "POST",
            url: "/device/checkin"
        },
        postTransactions: {
            method: "POST",
            url: "/device/transactions"
        },
        postPhotos_batchMode: {
            method: "POST",
            url: "/device/transactionphotos"
        },
        postTransactionExtras: {
            method: "POST",
            url: "/device/transactionsextra"
        },
        employeeProfile: {
            method: "POST",
            url: "/employee/profile"
        },
        employeeRequestPTO: {
            method: "POST",
            url: "/employee/PTO"
        },
        employeeGetTimecardDetail: {
            method: "GET",
            url: "/timecard/detail"
        },
        employeeGetTimecardDetailPrint: {
            method: "GET",
            url: "/timecard/detailprint"
        },
        employeeGetTimecardDetailPrintReceipt: {
            method: "GET",
            url: "/timecard/detailprintreceipt"
        },
        employeeGetTimecardSummary: {
            method: "GET",
            url: "/timecard/summary"
        },
        employeeEmailTimecard: {
            method: "GET",
            url: "/timecard/email"
        },
        employeeTextTimecard: {
            method: "GET",
            url: "/timecard/text"
        },
        employeePrintTimecard: {
            method: "POST",
            url: "/timecard/print"
        },
        getPhotos: {
            method: "POST",
            url: "/device/getPhotos"
        },
        getLogo: {
            method: "GET",
            url: "/device/getLogo"
        },
        getHelpFiles: {
            method: "POST",
            url: "/device/getHelpFiles"
        },
        getSchedule: {
            method: "GET",
            url: "/timecard/reportschedule"
        },
        updateSchedule: {
            method: "POST",
            url: "/timecard/schedulereport"
        },
        sendLogs: {
            method: "POST",
            url: "/device/log"
        },
        missedBreak: {
            method: "POST",
            url: "/timecard/immediatePunch"
        },
        postExceptions: {
            method: "POST",
            url: "/timecard/postExceptions"
        },
        hoursVerification: {
            method: "POST",
            url: "/timecard/hoursVerification"
        },
        insertHoursVerification: {
            method: "POST",
            url: "/timecard/insertHoursVerification"
        }
    }
};