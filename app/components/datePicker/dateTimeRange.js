import DatePicker from "./default"

const DateTimeRange = ({ selected, onChange }) => {
    return <DatePicker
        showDisabledMonthNavigation
        showTimeSelect 
        {
        ...{
            selected: selected,
            onChange: onChange,
            minDate: new Date(),
            timeFormat: "HH:mm",
            timeIntervals: 1,
            dateFormat: "MMMM d, yyyy h:mm aa",
            timeCaption: "time"
        }
        }

    />
}

export default DateTimeRange;