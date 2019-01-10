import "style/VotingProgress.less";

const VotingProgress = ({ style, yesNum, noNum, showNumber }) => (
    <div>
        {showNumber ? <div className="voting-progress-statistics">

            <div>{noNum}</div>
            <div className="voting-progress-no-num"></div>
            <div>{yesNum}</div>
            <div className="voting-progress-yes-num"></div>
        </div> : null}
        <div className="voting-progress-indicator" style={style}>
            <div className="voting-progress-yes" style={{ width: `${(yesNum / (yesNum + noNum)) * 100}%` }}></div>
            <div className="voting-progress-no" style={{ width: `${(noNum / (yesNum + noNum)) * 100}%` }}></div>
        </div>
    </div>

);

export default VotingProgress;
