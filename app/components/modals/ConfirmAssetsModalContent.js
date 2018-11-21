import "style/ReceivePage.less";
import { FormattedMessage as T } from "react-intl"; 

export default ({ name,
    category,
    subCategory,
    url,
    description,
    address,
    amount}) => (
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
                <div><T id="omni.assets.infoForm.Tokens" m="Number of token"/>：</div>
                <div>{amount} </div>
            </div>
            <div>
                <div><T id="omni.assets.infoForm.issueAddress" m="Issue address"/>:</div>
                <div>{address} </div>
            </div>
            
        </div>
    );
