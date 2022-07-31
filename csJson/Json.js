const userData = {
	name: "hDesign",
	headimgurl: "/static/images/avatar.jpeg",
	id: "28***06",
	phone: "136***1234",
	withdrawable: 536.25,
	coming: 255.88,
	came: 1568.55,
	withdrawed: 756.32
}

const income = {
	month: [{
		order_no: 202205042514821,
		money: 200.25,
		status: 1,
		create_time: '2022.05.04 15:20'
	}, {
		order_no: 202205052514523,
		money: 158.35,
		status: 1,
		create_time: '2022.05.05 22:46'
	}, {
		order_no: 202205062515747,
		money: 357.85,
		status: 1,
		create_time: '2022.05.06 12:36'
	}, {
		order_no: 202205072514141,
		money: 118.75,
		status: 1,
		create_time: '2022.05.07 20:18'
	}],
	today: [{
		order_no: 202205072514141,
		money: 118.75,
		status: 1,
		create_time: '2022.05.07 20:18'
	}, {
		order_no: 202205072514141,
		money: 118.75,
		status: 1,
		create_time: '2022.05.07 20:18'
	}],
	yesterday: [{
		order_no: 202205062515747,
		money: 357.85,
		status: 1,
		create_time: '2022.05.06 12:36'
	}, {
		order_no: 202205062515747,
		money: 357.85,
		status: 1,
		create_time: '2022.05.06 12:36'
	}]
}
const extractList = [{
	extract_no: 20220506250041,
	real_money: 1001.11,
	status: 1,
	create_time: '2022.05.06 12:36'
}, {
	extract_no: 20220506456211,
	real_money: 28.39,
	status: 1,
	create_time: '2022.05.05 18:33'
}, {
	extract_no: 20220506456211,
	real_money: 17.28,
	status: 2,
	create_time: '2022.05.05 18:33'
}, {
	extract_no: 20220506456211,
	real_money: 57.85,
	status: 3,
	create_time: '2022.05.05 18:33'
}]
const pool = {
	pool: "128.28",
	least_money: 10,
	fee: "0.10",
}
export default {
	userData,
	incomeMonth: income.month,
	incomeToday: income.today,
	incomeYesterday: income.yesterday,
	extractList,
	pool
}
