module.exports = {
	apps: [
		{
			name: 'nginx',
			script: 'nginx',
			args: '-g "daemon off;"',
			exec_mode: 'fork',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '200M',
			env: {
				NODE_ENV: 'production',
			},
		},
		{
			name: 'backend',
			script: './backend/dist/app.js',
			cwd: '/app',
			exec_mode: 'fork',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '500M',
			env: {
				NODE_ENV: 'production',
				PORT: 3000,
			},
			error_file: '/app/logs/backend-error.log',
			out_file: '/app/logs/backend-out.log',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			merge_logs: true,
		},
	],
}
