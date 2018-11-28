import DatePicker from "./default"

const DateTimeRange = (props) => {
    return <DatePicker
        showDisabledMonthNavigation
        showTimeSelect
        {
        ...{
            timeFormat: "HH:mm",
            timeIntervals: 1,
            dateFormat: "MMMM d, yyyy h:mm aa",
            timeCaption: "time"
        } 
        }
        {
        ...props
        }

    />
}

export default DateTimeRange;