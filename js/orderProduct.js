/**
 * Created by sunhui on 2017/10/24.
 */
$(function () {
    //初始化函数
    init();

    function init(){
        //弹层默认隐藏
        $(".modal").hide();
        //获取数据及页面展示
        getData();
    }

    //从后台获取数据
    function getData() {
        $.getJSON("json/data.json",function(data){
            if(data.result==0){
                var responseData = data;
                $(".product-image").attr("src",responseData.productInfo.imgUrl);
                //给product-single模块赋值
                setDataToPage("product-single",responseData);
                //给single-price赋值
                setDataToPage("single-price",responseData);
                //给立即下单页面表格赋值
                setDataToTable(responseData);
            }
        });
    }

    //给产品详情页数据
    function setDataToPage(className,data) {
        $("."+className+" span").each(function(){
            var productInfo=data.productInfo;
            var dataKey=$(this).attr("data-attribute");
            $(this).text(productInfo[dataKey]);
        });
    }

    //立即购买
    $(".buy-now span").click(function(){
        $(".modal").show();
    });

    //给页面元素赋值
   function setDataToTable(data) {
       $("table tbody tr td").each(function () {
           var dataTrKey=$(this).parent("tr").attr("data-attribute");
           var colorSizeNum=data.productInfo.color;
           var singleColorSizeNum=colorSizeNum[dataTrKey];
           var tableTdKey=$(this).children("input").attr("data-attribute");
           var colorSize=getSigleColorSize(singleColorSizeNum,tableTdKey);
           $(this).children("input").attr('placeholder',colorSize);
       })
   }

    //获取单个表格单元的值
    function getSigleColorSize(total,key) {
        for(var i in total){
            if(total[i].colorSize==key){
                return total[i].colorNum;
            }
        }
    }

    //校验：1、不能输入除数字外其他字符；2、判断是否超出库存
    $("table tbody tr td input").keyup(function () {
        var value=$(this).val().replace(/[^\d]/g,'');
        $(this).val(value);
        checkIsLargeTotal(this);
    });

    //表格单元中input绑定事件
    $("table tbody tr td input").mouseout(function () {
        var checkInput=checkIsLargeTotal(this);
        if(checkInput == false){
            return;
        }else{
            setTdTotalNum(checkInput);
        }
    });

    //判断是否超出库存
    function checkIsLargeTotal(obj) {
        var currentNum=Number($(obj).val());
        var totalNum=Number($(obj).attr('placeholder'));
        var currentTr=$(obj).parent("td").parent("tr").attr("data-attribute");
        var currentTd=$(obj).attr("data-attribute");
        if(currentNum > totalNum){
            alert("库存不足，超出库存");
            $(obj).val("");
            //重新获取焦点
            setTimeout(function() {
                $("table tbody tr[data-attribute="+currentTr+"] td input[data-attribute="+currentTd+"]").focus();
            }, 0);
            return false;
        }else{
            return currentTr;
        }
    }

    //计算每行总数、总共件数、总价
    function setTdTotalNum(trName) {
        var singleSizetotal = Number(0);
        var totalNum = Number(0);
        $("table tbody tr[data-attribute="+trName+"] td input").each(function () {
            singleSizetotal += Number($(this).val());
        });
        $("table tbody tr[data-attribute="+trName+"] td[data-attribute=total]").text(singleSizetotal);
        $("table tbody tr td[data-attribute=total]").each(function (){
            totalNum += Number($(this).text());
        });
        $(".sum-num").text(totalNum);
        var singlePrice=Number($(".price").text());
        $(".sum-price").text(totalNum*singlePrice);
        if(totalNum > 0){
            $(".order-btn").css("background-color",'#f14344');
            $(".order-btn").attr("disabled",false);
        }else{
            $(".order-btn").css("background-color",'#6f6f6f');
            $(".order-btn").attr("disabled",true);
        }
    }

    //下单操作
    $(".order-btn").click(function () {
        alert("下单成功");
    })
    
});
