import React, {
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';

import axiosInstance from '../axios';
import getReduxState from '../ReduxState';

const WorkListContext = createContext();

export const WorkListProvider = ({ children }) => {

    const {
        empId,
        deptid,
        BrnchKey,
        role
    } = getReduxState();

    const [transCount, setTransCount] = useState(0);
    const [transferData, setTransferData] = useState([]);

    const [payableCount, setPayableCount] = useState(0);
    const [payableData, setPayableData] = useState([]);

    const [selectedTransData, setSelectedTransData] = useState(null);
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const fetchTransferData = async () => {

        try {
            const requestData = {
                EmpId: empId,
                StaffId: empId,
                DeptId: deptid,
                BrnchId: BrnchKey,
                YearId: 2627,
                UserGroup: role,
                IsCompleted: false,
                IsTransfered: false
            };

            const response = await axiosInstance.post(
                '/WorkListAPI/GetWorkList',
                requestData
            );
            if (response.data) {

                // Transfer Notification
                const transferTickets = response.data.filter(
                    item => item.Tkt_Transfer === true
                );

                setTransferData(transferTickets);
                setTransCount(transferTickets.length);


            }

        } catch (error) {
            console.log(error);
        }
    };

    const fetchpayableService = async () => {
        try {
            const response = await axiosInstance.get(
                `/IsPayableServAPI/GetTicketList`
            );

            //console.log("payable response", response);

            if (response?.data?.data) {

                const activeTickets = response.data.data.filter(
                    item => item.IsCancelled !== true &&
                        item.IsCompleted === true &&
                        item.IsPayableServCompleted !== true
                );

                setPayableData(activeTickets);
                setPayableCount(activeTickets.length);
            }
        } catch (error) {
            console.log("Error while fetch payable service count", error);
        }
    };

  //  console.log("payable data", payableData)

    useEffect(() => {
        fetchTransferData();
        fetchpayableService()
    }, []);

    return (
        <WorkListContext.Provider
            value={{
                transCount,
                setTransCount,
                transferData,
                setTransferData,
                selectedTransData,
                setSelectedTransData,

                payableCount,
                setPayableCount,
                payableData,
                setPayableData,

                shouldHighlight,
                setShouldHighlight,
                fetchTransferData
            }}
        >
            {children}
        </WorkListContext.Provider>
    );
};

export const useWorkList = () => useContext(WorkListContext);