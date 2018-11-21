import "style/ReceivePage.less";
import { FormattedMessage as T } from "react-intl"; 

export default ({ name,
    category,
    subCategory,
    url,
    description,
    fromAddress,
    earlyBonus,
    issuerPercentage,
    deadline,
    selectedCurrency}) => (
        <div className="confirmAssetsModal-content">
            <div>
                <div> <T id="omni.assets.infoForm.name" m="Category"/>：</div>
                <div>{name}</div>
            </div>
            <div>
                <div> <T id="omni.assets.infoForm.category" m="Category"/>：</div>
                <div>{category.categoryName} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.subCategory" m="Sub Category"/>：</div>
                <div>{subCategory.categoryName} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.URL" m="Asset URL"/>：</div>
                <div>{url} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.description" m="Description"/>：</div>
                <div>{description} </div>
            </div> 
            
           
            <div>
                <div> <T id="omni.assets.infoForm.earlyBonus" m="Weekly early bird bonus percentage" />:</div>
                <div>{earlyBonus} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.issuerPercentage" m="Percentage for issuer" />:</div>
                <div>{issuerPercentage} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.deadline" m="Deadline" />:</div>
                <div>{deadline.toUTCString()} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.issueAddress" m="Issue address"/>:</div>
                <div>{fromAddress} </div>
            </div>

             <div>
                <div><T id="omni.assets.infoForm.selectedCurrency" m="Supported currency" />:</div>
                <div>{selectedCurrency} </div>
            </div>
            
        </div>
    );
